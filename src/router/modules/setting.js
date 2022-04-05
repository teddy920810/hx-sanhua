/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/setting',
  component: Layout,
  redirect: '/setting/permission-manage',
  name: 'SettingManage',
  meta: {
    title: '系统设置',
    icon: 'nav_icon5'
  },
  children: [
    {
      path: 'permission-manage',
      component: () => import('@/views/setting/permission/index'),
      name: 'PermissionManage',
      meta: { title: '权限管理' }
    },
    {
      path: 'role-manage',
      component: () => import('@/views/setting/role/index'),
      name: 'RoleManage',
      meta: { title: '角色管理' }
    },
    {
      path: 'trees-manage',
      component: () => import('@/views/setting/trees/index'),
      name: 'TreesManage',
      meta: { title: '字典管理' }
    },
    {
      path: 'trees-manage-child',
      component: () => import('@/views/setting/trees/index-child'),
      name: 'TreesManageChild',
      meta: { title: '字典管理' },
      hidden: true
    },
    {
      path: 'min-program-manage',
      component: () => import('@/views/setting/min-program'),
      name: 'MinProgramManage',
      meta: { title: '小程序管理' }
    }
  ]
}
export default tableRouter
