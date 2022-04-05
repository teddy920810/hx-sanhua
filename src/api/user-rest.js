import qs from 'qs'
import request from '@/utils/request'

export function login(data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/users/login',
    method: 'put',
    // qs 库转换。
    data: qs.stringify(data)
  })
}

export function refreshToken(query) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/users/authorize/refresh',
    method: 'put',
    params: query
  })
}

/* export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}*/

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function fetchList(data, query) {
  return request({
    url: '/user/info/search/page',
    method: 'post',
    params: query,
    data
  })
}

export function search(data) {
  return request({
    url: '/user/info/search',
    method: 'post',
    data
  })
}

export function createData(data) {
  return request({
    url: '/user/info/save/form',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/user/info/save/form',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/user/info/${id}/logic`,
    method: 'delete'
  })
}
