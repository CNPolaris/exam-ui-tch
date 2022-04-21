import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getStudentRecordList(data) {
  return request({
    url: '/teacher/exam/answer/record/list',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'post',
    data: data
  })
}

export function teacherReadAnswer(id) {
  return request({
    url: '/teacher/exam/answer/read/' + id,
    headers: {
      'Authorization': 'Bearer ' + getToken()
    },
    method: 'get'
  })
}

export function editExamPaperAnswer(data) {
  return request({
    url: '/teacher/exam/answer/edit',
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + getToken(),
      'Content-Type': 'application/json'
    },
    data: data
  })
}
