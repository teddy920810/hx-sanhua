const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@title(5, 10)',
    key: 'mock data',
    parentName: '@title(1, 2)'
  }))
}

module.exports = [
  {
    url: '/codes/search/page',
    type: 'post',
    response: config => {
      const { importance, type, title, pageNumber = 1, pageSize = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < pageSize * pageNumber && index >= pageSize * (pageNumber - 1))

      return {
        code: 20000,
        body: {
          totalElements: mockList.length,
          content: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/codes/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/codes/save',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        body: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/codes/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // delete
  {
    url: '/codes/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      body: {
        status: 'success'
      }
    }
  }
]

