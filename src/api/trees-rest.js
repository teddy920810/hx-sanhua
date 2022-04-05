import request from '@/utils/request'

export function fetchList(data, query) {
  return request({
    url: '/trees/search/page',
    method: 'post',
    params: query,
    data
  })
}

export function search(data) {
  return request({
    url: '/trees/search',
    method: 'post',
    data
  })
}

export function createData(data) {
  return request({
    url: '/trees/save',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/trees/save',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/trees/${id}/logic`,
    method: 'delete'
  })
}
