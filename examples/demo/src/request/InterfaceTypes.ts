import type { Interfaces as SwaggerInterface } from './interfacesCollection'

export type UrlKey = keyof SwaggerInterface
export type MethodKey<U extends UrlKey> = string & keyof SwaggerInterface[U]

type SwaggerInterfaceSingle<U extends UrlKey, M extends MethodKey<U>> = SwaggerInterface[U][M]
type SwaggerField<U extends UrlKey, M extends MethodKey<U>> = keyof SwaggerInterfaceSingle<U, M>
type SwaggerFieldType<
  U extends UrlKey,
  M extends MethodKey<U>,
  F extends SwaggerField<U, M>,
> = SwaggerInterfaceSingle<U, M>[F]

export type Param<U extends UrlKey, M extends MethodKey<U>> = SwaggerFieldType<
  U,
  M,
  'param' & SwaggerField<U, M>
>
export type Response<U extends UrlKey, M extends MethodKey<U>> = SwaggerFieldType<
  U,
  M,
  'response' & SwaggerField<U, M>
>
