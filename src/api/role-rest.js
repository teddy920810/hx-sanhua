import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/roles',
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: '/roles/save',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/roles/save',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/roles/${id}/logic`,
    method: 'delete'
  })
}
