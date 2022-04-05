import request from '@/utils/request-no-version'

export function uploadFile(data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/file/upload', // multipart/form-data
    method: 'post',
    data
  })
}

export function getFile(id) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob',
    url: `/file/${id}/download`,
    method: 'get'
  })
}
