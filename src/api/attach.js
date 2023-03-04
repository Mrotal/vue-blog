import request from '@/utils/request'


export function add(data) {
  var params = new FormData()
  params.append('uploadfile', data)
  return request({
    url: '/file/uploadfile',
    method: 'post',
    data: params,
    // headers: { "Content-Type": "multipart/form-data" },
  })
}
