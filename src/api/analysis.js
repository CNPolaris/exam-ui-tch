import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getStudentResultPage(data) {
  return request({
    url: '/exam/analysis/student/list',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function getStatisticsInfo(data) {
  return request({
    url: '/exam/analysis/statistics',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function getStatisticsStudent(data) {
  return request({
    url: '/exam/analysis/statistics/student',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post',
    data: data
  })
}

export function getStudentAnswerList(id) {
  return request({
    url: '/student/analysis/result/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    method: 'post'
  })
}
