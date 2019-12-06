import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/contents',
    method: 'get',
    params: query
  })
}

export function fetchContent(id) {
  return request({
    url: '/system/contents/' + id,
    method: 'get'
  })
}

export function createContent(data) {
  return request({
    url: '/system/contents',
    method: 'post',
    data
  })
}

export function updateContent(id, data) {
  return request({
    url: `/system/contents/` + id,
    method: 'put',
    data
  })
}

export function deleteContent(id) {
  return request({
    url: '/system/contents/' + id,
    method: 'delete'
  })
}

