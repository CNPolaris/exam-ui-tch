import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getClassList() {
  return request({
    url: '/teacher/class/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post'
  })
}

export function getClassPage(data) {
  return request({
    url: '/teacher/class/page',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: data
  })
}

export function getStudentList(id, data) {
  return request({
    url: '/teacher/class/student/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: data
  })
}

export function updateClass(id, query) {
  return request({
    url: '/admin/class/update/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}

export function editClass(query) {
  return request({
    url: '/admin/class/edit',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: query
  })
}

export function getClassMessage(id) {
  return request({
    url: '/teacher/class/message/student/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function getClassByPaperId(id) {
  return request({
    url: '/teacher/class/analyse/list/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}
