/**
 * 申请班组长相关接口
 */
import request from '@/utils/request'

export function fetchList(data, query) {
  return request({
    url: '/requests/search/page',
    method: 'post',
    params: query,
    data
  })
}

export function applyData(data) {
  return request({
    url: '/requests/save',
    method: 'post',
    data
  })
}
