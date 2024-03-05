import { computed, ref, shallowRef, unref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { EventHookOn, Fn, MaybeRef, Stoppable } from '@vueuse/shared'
import { createEventHook, until, useTimeoutFn } from '@vueuse/shared'
import type { MethodKey, Param, Response as Res, UrlKey } from './InterfaceTypes'
import type { FetchOptions } from './fetch'
import customFetch from './fetch'

export interface UseFetchReturn<P, R> {
  /**
   * Any fetch errors that may have occurred
   */
  error: Ref<any>

  /**
   * The fetch response body, may either be JSON or text
   */
  data: Ref<R | null>

  /**
   * Indicates if the fetch request has finished
   */
  isFinished: Ref<boolean>

  /**
   * Indicates if the request is currently being fetched.
   */
  isFetching: Ref<boolean>

  /**
   * Indicates if the fetch request is able to be aborted
   */
  canAbort: ComputedRef<boolean>

  /**
   * Indicates if the fetch request was aborted
   */
  aborted: Ref<boolean>

  /**
   * Abort the fetch request
   */
  abort: Fn

  /**
   * Manually call the fetch
   * (default not throwing error)
   */
  execute: (throwOnFailed?: boolean) => Promise<any>

  /**
   * Fires after the fetch request has finished
   */
  onFetchResponse: EventHookOn<Response>

  /**
   * Fires after a fetch request error
   */
  onFetchError: EventHookOn

  /**
   * Fires after a fetch has completed
   */
  onFetchFinally: EventHookOn

  // methods
  send: (payload?: MaybeRef<P>) => UseFetchReturn<P, R>
}

type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'

export interface UseFetchOptions {
  /**
   * Will automatically run fetch when `useFetch` is used
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Will automatically refetch when:
   * - the payload is changed if the payload is a ref
   *
   * @default true
   */
  refetch?: MaybeRef<boolean>

  /**
   * Initial data before the request finished
   *
   * @default null
   */
  initialData?: any

  /**
   * Timeout for abort request after number of millisecond
   * `0` means use browser default
   *
   * @default 0
   */
  timeout?: number

  /**
   * 数据类型，default 'json'
   */
  type?: DataType

  /**
   * 请求参数类型，default 'json'
   */
  payloadType?: FetchOptions['payloadType']
}

function headersToObject(headers: HeadersInit | undefined) {
  if (headers instanceof Headers)
    return Object.fromEntries(headers.entries())
  return headers
}

export default function useFetch<
  U extends UrlKey,
  M extends MethodKey<U>,
  P extends Param<U, M>,
  R extends Res<U, M>,
>(
  url: MaybeRef<U>,
  method: M,
  _params?: MaybeRef<P>,
  useFetchOptions: UseFetchOptions = {},
  requestOptions: RequestInit = {},
): UseFetchReturn<P, R> & PromiseLike<UseFetchReturn<P, R>> {
  const supportsAbort = typeof AbortController === 'function'

  let fetchOptions: RequestInit = requestOptions
  const options: UseFetchOptions = {
    immediate: true,
    refetch: true,
    timeout: 10000,
    ...useFetchOptions,
  }
  const { initialData = null, timeout, payloadType = 'form-urlencoded', type = 'json' } = options

  // @ts-expect-error  注入 params
  const params: Ref<P | undefined> = ref<P | undefined>(unref(_params))

  // Event Hooks
  const responseEvent = createEventHook<Response>()
  const errorEvent = createEventHook<any>()
  const finallyEvent = createEventHook<any>()

  const isFinished = ref(false)
  const isFetching = ref(false)
  const aborted = ref(false)
  const error = ref<any>(null)
  const data = shallowRef<R | null>(initialData)

  const canAbort = computed(() => supportsAbort && isFetching.value)

  let controller: AbortController | undefined
  let timer: Stoppable | undefined

  const abort = () => {
    if (supportsAbort && controller)
      controller.abort()
  }

  const loading = (isLoading: boolean) => {
    isFetching.value = isLoading
    isFinished.value = !isLoading
  }

  if (timeout)
    timer = useTimeoutFn(abort, timeout, { immediate: false })

  const execute = async (throwOnFailed = false) => {
    loading(true)
    error.value = null
    aborted.value = false
    controller = undefined

    if (supportsAbort) {
      controller = new AbortController()
      controller.signal.onabort = () => (aborted.value = true)
      fetchOptions = {
        ...fetchOptions,
        signal: controller.signal,
      }
    }

    const isCanceled = false

    if (isCanceled || !fetch) {
      loading(false)
      return Promise.resolve(null)
    }

    if (timer)
      timer.start()

    return new Promise<R | null>((resolve, reject) => {
      customFetch(unref(url), method, unref(params), {
        type,
        payloadType,
        ...fetchOptions,
        headers: {
          ...headersToObject(fetchOptions.headers),
        },
      })
        .then(async (res) => {
          data.value = res
          // @ts-expect-error // TODO
          return resolve(res)
        })
        .catch(async (fetchError) => {
          const errorData = fetchError.message || fetchError.name
          data.value = null
          error.value = errorData
          errorEvent.trigger(fetchError)
          if (throwOnFailed)
            return reject(fetchError)
          return resolve(null)
        })
        .finally(() => {
          loading(false)
          if (timer)
            timer.stop()
          finallyEvent.trigger(null)
        })
    })
  }
  watch(
    () => unref(_params),
    () => (params.value = unref(_params)),
    { deep: true },
  )
  watch(
    [() => unref(url), () => unref(params), () => unref(options.refetch)],
    () => unref(options.refetch) && execute(),
    { deep: true },
  )

  const shell: UseFetchReturn<P, R> = {
    isFinished,
    error,
    // @ts-expect-error // TODO
    data,
    isFetching,
    canAbort,
    aborted,
    abort,
    execute,

    onFetchResponse: responseEvent.on,
    onFetchError: errorEvent.on,
    onFetchFinally: finallyEvent.on,
  }

  function waitUntilFinished() {
    return new Promise<UseFetchReturn<P, R>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(shell))
        .catch((error: any) => reject(error))
    })
  }

  if (options.immediate)
    setTimeout(execute, 0)

  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilFinished().then(onFulfilled, onRejected)
    },
  }
}
