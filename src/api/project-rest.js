import request from '@/utils/request'

export function fetchList(data, query) {
  return request({
    url: '/projects/search/page',
    method: 'post',
    params: query,
    data
  })
}

export function search(data) {
  return request({
    url: '/projects/search',
    method: 'post',
    data
  })
}

export function createData(data) {
  return request({
    url: '/projects/save',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/projects/save',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/projects/${id}/logic`,
    method: 'delete'
  })
}
