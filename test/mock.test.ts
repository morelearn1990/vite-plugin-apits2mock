import { describe, expect, it } from 'vitest'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import mockjs from 'mockjs'
import { mock, schema2MockTemp } from '../src/mock'

describe('mock ts', () => {
  it('exported', () => {
    const rootSchema: JSONSchema7 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/AdminApi',
      definitions: {
        'AdminApi': {
          type: 'object',
          properties: {
            'admin/menu': {
              type: 'object',
              properties: {
                get: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        query: {
                          type: 'object',
                          properties: {
                            pageSize: {
                              type: 'number',
                            },
                            page: {
                              type: 'number',
                            },
                          },
                          required: [
                            'pageSize',
                            'page',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'query',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'number',
                          },
                          path: {
                            type: 'string',
                          },
                          children: {
                            type: 'array',
                            items: {
                              $ref: '#/definitions/interface-41815186-0-70-41815186-0-1402',
                            },
                          },
                        },
                        required: [
                          'id',
                          'path',
                        ],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
              },
              required: [
                'get',
              ],
              additionalProperties: false,
            },
            'admin/user': {
              type: 'object',
              properties: {
                get: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        query: {
                          type: 'object',
                          properties: {
                            pageSize: {
                              type: 'number',
                            },
                            page: {
                              type: 'number',
                            },
                            name: {
                              type: 'string',
                            },
                          },
                          required: [
                            'pageSize',
                            'page',
                            'name',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'query',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      properties: {
                        list: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string',
                              },
                              id: {
                                type: 'number',
                              },
                            },
                            required: [
                              'name',
                              'id',
                            ],
                            additionalProperties: false,
                          },
                        },
                        total: {
                          type: 'number',
                        },
                        page: {
                          type: 'number',
                        },
                      },
                      required: [
                        'list',
                        'total',
                        'page',
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
                post: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        body: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                          },
                          required: [
                            'name',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'body',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        id: {
                          type: 'number',
                        },
                      },
                      required: [
                        'name',
                        'id',
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
              },
              required: [
                'get',
                'post',
              ],
              additionalProperties: false,
            },
            'admin/user/{id}': {
              type: 'object',
              properties: {
                get: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        path: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                          },
                          required: [
                            'id',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'path',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        id: {
                          type: 'number',
                        },
                      },
                      required: [
                        'name',
                        'id',
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
                post: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        body: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                          },
                          required: [
                            'name',
                          ],
                          additionalProperties: false,
                        },
                        path: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                          },
                          required: [
                            'id',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'body',
                        'path',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        id: {
                          type: 'number',
                        },
                      },
                      required: [
                        'name',
                        'id',
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
              },
              required: [
                'get',
                'post',
              ],
              additionalProperties: false,
            },
            'admin/student/{id}': {
              type: 'object',
              properties: {
                get: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        path: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                          },
                          required: [
                            'id',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'path',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        age: {
                          type: 'number',
                        },
                        grade: {
                          type: 'number',
                        },
                        name: {
                          type: 'string',
                        },
                        id: {
                          type: 'number',
                        },
                      },
                      required: [
                        'age',
                        'grade',
                        'id',
                        'name',
                      ],
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
                post: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        body: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                          },
                          required: [
                            'name',
                          ],
                          additionalProperties: false,
                        },
                        path: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                          },
                          required: [
                            'id',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'body',
                        'path',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        age: {
                          type: 'number',
                        },
                        grade: {
                          type: 'number',
                        },
                        name: {
                          type: 'string',
                        },
                        id: {
                          type: 'number',
                        },
                      },
                      required: [
                        'age',
                        'grade',
                        'id',
                        'name',
                      ],
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
              },
              required: [
                'get',
                'post',
              ],
              additionalProperties: false,
            },
            'admin/teacher/{id}': {
              type: 'object',
              properties: {
                get: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        path: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                          },
                          required: [
                            'id',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'path',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        id: {
                          type: 'number',
                        },
                        grade: {
                          type: 'number',
                        },
                      },
                      required: [
                        'name',
                        'id',
                        'grade',
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
                post: {
                  type: 'object',
                  properties: {
                    param: {
                      type: 'object',
                      properties: {
                        body: {
                          type: 'object',
                          properties: {
                            name: {
                              type: 'string',
                            },
                          },
                          required: [
                            'name',
                          ],
                          additionalProperties: false,
                        },
                        path: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                          },
                          required: [
                            'id',
                          ],
                          additionalProperties: false,
                        },
                      },
                      required: [
                        'body',
                        'path',
                      ],
                      additionalProperties: false,
                    },
                    response: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        id: {
                          type: 'number',
                        },
                        grade: {
                          type: 'number',
                        },
                      },
                      required: [
                        'name',
                        'id',
                        'grade',
                      ],
                      additionalProperties: false,
                    },
                  },
                  required: [
                    'param',
                    'response',
                  ],
                  additionalProperties: false,
                },
              },
              required: [
                'get',
                'post',
              ],
              additionalProperties: false,
            },
          },
          required: [
            'admin/menu',
            'admin/user',
            'admin/user/{id}',
            'admin/student/{id}',
            'admin/teacher/{id}',
          ],
          additionalProperties: false,
        },
        'interface-41815186-0-70-41815186-0-1402': {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            path: {
              type: 'string',
            },
            children: {
              type: 'array',
              items: {
                $ref: '#/definitions/interface-41815186-0-70-41815186-0-1402',
              },
            },
          },
          required: [
            'id',
            'path',
          ],
          additionalProperties: false,
        },
      },
    }

    const temp1 = schema2MockTemp(rootSchema, {
      type: 'object',
      properties: {
        page: {
          type: 'number',
        },
        pageIndex: {
          type: 'number',
        },
        list: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    })
    console.log('=======> 1\n', mockjs.mock(temp1), temp1)

    const temp2 = schema2MockTemp(rootSchema, {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          path: {
            type: 'string',
          },
          children: {
            type: 'array',
            items: {
              $ref: '#/definitions/interface-41815186-0-70-41815186-0-1402',
            },
          },
        },
        required: [
          'id',
          'path',
        ],
        additionalProperties: false,
      },
    })
    console.log('=======> 2\n', JSON.stringify(mockjs.mock(temp2)), JSON.stringify(temp2, null, 2))

    expect(1).toEqual(1)
  })
})
