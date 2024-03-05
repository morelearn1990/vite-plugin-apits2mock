interface Menu {
  id: number
  path: string
  children?: Menu[]
}

interface User {
  name: string
  id: number
}

type Student = User & {
  age: number
  grade: number
}

type Teacher = Omit<Student, 'age'>

export default interface AdminApi {
  'admin/menu': {
    get: {
      param: {
        query: {
          pageSize: number
          page: number
        }
      }
      response: Menu[]
    }
  }
  'admin/user': {
    get: {
      param: { query: { pageSize: number, page: number, name: string } }
      response: {
        list: User[]
        total: number
        page: number
      }
    }
    post: {
      param: { body: { name: string } }
      response: User
    }
  }
  'admin/user/{id}': {
    get: {
      param: { path: { id: string } }
      response: User
    }
    post: {
      param: { body: { name: string }, path: { id: string } }
      response: User
    }
  }

  'admin/student/{id}': {
    get: {
      param: { path: { id: string } }
      response: Student
    }
    post: {
      param: { body: { name: string }, path: { id: string } }
      response: Student
    }
  }

  'admin/teacher/{id}': {
    get: {
      param: { path: { id: string } }
      response: Teacher
    }
    post: {
      param: { body: { name: string }, path: { id: string } }
      response: Teacher
    }
  }
}
