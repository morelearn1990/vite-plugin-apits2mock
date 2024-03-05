# 请求接口定义

在 ts 里对接口进行定义，然后通过 vite mock 插件解析 ts 接口定义文件并生成 mock 接口

## 接口定义说明示例

```ts
interface RequestInterface {
  '/user/{id}/friends': {
    get: {
      param: {
        path: { id: string }
        query: { age: number }
      }
      response: { friendId: string, name: string, desc?: string }[]
    }
    post: {
      param: {
        path: { id: string }
        body: {
          friendId?: string
          name: string
        }
      }
      response: { friendId: string, name: string, desc?: string }
    }
  }
}
```

## 接口请求说明

通过定义好的类型，处理请求接口，让请求能更好的提示和校验
