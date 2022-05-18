import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getReceiveMessageList(query) {
  return request({
    url: '/teacher/message/send/history',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}

export function sendMessage(query) {
  return request({
    url: '/teacher/message/send',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: query
  })
}

export function getMessageCount() {
  return request({
    url: '/message/count',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function getMessageList(data) {
  return request({
    url: '/message/list',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}
export function readMessage(id) {
  return request({
    url: '/message/read/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'get'
  })
}
