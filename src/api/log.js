import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/logs',
    method: 'get',
    params: query
  })
}

