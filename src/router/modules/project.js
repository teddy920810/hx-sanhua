/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/project',
  component: Layout,
  name: 'ProjectManage',
  meta: {
    title: '项目管理',
    icon: 'nav_icon1'
  },
  children: [
    {
      path: 'project-info',
      component: () => import('@/views/project/index'),
      name: 'ProjectInfo',
      meta: { title: '项目信息维护' }
    },
    {
      path: 'groups-manage',
      component: () => import('@/views/groups/index'),
      name: 'GroupsManage',
      meta: { title: '班组管理' },
      hidden: true
    },
    {
      path: 'project-status',
      component: () => import('@/views/project/index-status'),
      name: 'ProjectStatus',
      meta: { title: '项目状态管理' }
    }
  ]
}
export default tableRouter
