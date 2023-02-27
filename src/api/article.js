import request from '@/utils/request'

export function findPage(params) {
  return request({
    url: '/article/page',
    method: 'get',
    params: params
  })
}

export function insert(data) {
  return request({
    url: '/article',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/article',
    method: 'put',
    data: data
  })
}

export function getDetail(id) {
  return request({
    url: '/article/' + id,
    method: 'get'
  })
}

export function remove(id) {
  return request({
    url: '/article/' + id,
    method: 'delete'
  })
}


export function removeSelected(ids) {
  return request({
    url: '/article?ids=' + ids,
    method: 'delete'
  })
}
