import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/index',
    meta: {
      icon: 'dashboard'
    },
    children: [
      {
        path: '/dashboard/index',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          affix: true,
          roles: ['teacher']
        }
      }
    ]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人详情', icon: 'user', noCache: true }
      },
      {
        path: '/message/index',
        name: 'MessageIndex',
        component: () => import('@/views/message/index'),
        meta: {
          title: '消息中心'
        }
      }
    ]
  },
  {
    path: '/profile/timeline',
    component: () => import('@/views/profile/components/Timeline'),
    hidden: true
  },
  {
    path: '/exam/detail',
    component: () => import('@/views/exam/paper/detail'),
    name: 'ExamPaperDetail',
    meta: {
      title: '查看试卷',
      roles: ['admin', 'teacher']
    },
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/class',
    component: Layout,
    meta: {
      title: '班级管理',
      icon: 'el-icon-user',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/class/list',
        component: () => import('@/views/class/list'),
        meta: {
          title: '班级列表',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/class/student',
        component: () => import('@/views/class/studentList'),
        hidden: true
      }
    ]
  },
  {
    path: '/question',
    component: Layout,
    name: 'question',
    meta: {
      title: '题库管理',
      icon: 'el-icon-toilet-paper',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/question/list',
        component: () => import('@/views/question/list'),
        name: 'QuestionList',
        meta: {
          title: '题目列表',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/singleChoice',
        component: () => import('@/views/question/edit/single-choice'),
        name: 'singleChoicePage',
        meta: {
          title: '单选题编辑',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/shortAnswer',
        component: () => import('@/views/question/edit/short-answer'),
        name: 'shortAnswerPage',
        meta: {
          title: '简答题编辑',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/multipleChoice',
        component: () => import('@/views/question/edit/multiple-choice'),
        name: 'multipleChoicePage',
        meta: {
          title: '多选题编辑',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/gapFilling',
        component: () => import('@/views/question/edit/gap-filling'),
        name: 'gapFillingPage',
        meta: {
          title: '填空题编辑',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/question/edit/trueFalse',
        component: () => import('@/views/question/edit/true-false'),
        name: 'trueFalsePage',
        meta: {
          title: '判断题编辑',
          roles: ['admin', 'teacher']
        }
      }
    ]
  },
  {
    path: '/exam',
    component: Layout,
    name: 'exam',
    meta: {
      title: '卷库管理',
      icon: 'education',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/exam/list',
        component: () => import('@/views/exam/paper'),
        name: 'PaperList',
        meta: {
          title: '试卷列表',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/exam/edit',
        component: () => import('@/views/exam/paper/edit'),
        name: 'ExamEdit',
        meta: {
          title: '创建试卷',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/exam/smart',
        component: () => import('@/views/exam/paper/smart'),
        name: 'Smart',
        meta: {
          title: '智能组卷'
        }
      }
    ]
  },
  {
    path: '/exam/answer',
    component: Layout,
    name: 'answer',
    meta: {
      title: '答卷管理',
      icon: 'form',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/exam/answer/record/list',
        component: () => import('@/views/exam/answer/list'),
        meta: {
          icon: 'el-icon-close',
          title: '未批改'
        }
      },
      {
        path: '/exam/answer/complete/list',
        component: () => import('@/views/exam/answer/complete'),
        meta: {
          icon: 'el-icon-check',
          title: '已完成'
        }
      },
      {
        path: '/exam/answer/edit',
        component: () => import('@/views/exam/answer/edit'),
        meta: {
          title: '阅卷'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/exam/answer/read',
    component: () => import('@/views/exam/answer/read'),
    meta: {
      title: '查看答卷',
      roles: ['admin', 'teacher']
    },
    hidden: true
  },
  {
    path: '/exam/student/detail',
    name: 'detail',
    component: () => import('@/views/exam/result/detail'),
    meta: {
      title: '详情',
      roles: ['admin', 'teacher']
    },
    hidden: true
  },
  {
    path: '/exam/result',
    component: Layout,
    name: 'result',
    meta: {
      icon: 'el-icon-s-data',
      title: '成绩管理',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/exam/result/index',
        component: () => import('@/views/exam/result/index'),
        meta: {
          title: '试卷分析'
        }
      },
      {
        path: '/exam/result/analyze',
        component: () => import('@/views/exam/result/analyze'),
        meta: {
          title: '成绩分析'
        }
      },
      {
        path: '/exam/result/statistics',
        component: () => import('@/views/exam/result/statistics'),
        meta: {
          title: '考生统计'
        }
      }
    ]
  },
  {
    path: '/video',
    component: Layout,
    meta: {
      title: '视频管理',
      icon: 'el-icon-video-camera',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/video/list',
        component: () => import('@/views/video/index'),
        name: 'VideoList',
        meta: {
          title: '视频列表',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/video/edit',
        component: () => import('@/views/video/edit'),
        name: 'VideoEdit',
        meta: {
          title: '视频创编',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/video/preview',
        component: () => import('@/views/video/preview'),
        name: 'PreviewVideo',
        meta: {
          title: '视频预览',
          roles: ['admin', 'teacher']
        },
        hidden: true
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    meta: {
      title: '消息管理',
      icon: 'message',
      roles: ['admin', 'teacher']
    },
    children: [
      {
        path: '/message/list',
        component: () => import('@/views/message/list'),
        name: 'MessageList',
        meta: {
          title: '消息列表',
          roles: ['admin', 'teacher']
        }
      },
      {
        path: '/message/send',
        component: () => import('@/views/message/send'),
        name: 'SendMessage',
        meta: {
          title: '发送消息',
          roles: ['admin', 'teacher']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  base: '/teacher',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
