import request from '@/utils/request'

export function fetchList(data, query) {
  return request({
    url: '/groups/search/page',
    method: 'post',
    params: query,
    data
  })
}

export function search(data) {
  return request({
    url: '/groups/search',
    method: 'post',
    data
  })
}

export function findById(id) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/groups/${id}`,
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/groups/save',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/groups/save',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/groups/${id}/logic`,
    method: 'delete'
  })
}
