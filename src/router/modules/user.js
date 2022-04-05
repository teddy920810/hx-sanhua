/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/user',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'UserManage',
  meta: {
    title: '工人管理',
    icon: 'nav_icon2'
  },
  children: [
    {
      path: 'userinfo',
      component: () => import('@/views/user/index'),
      name: 'Userinfo',
      meta: { title: '工人信息维护' }
    },
    {
      path: 'user-verify',
      component: () => import('@/views/user/index-requests'),
      name: 'userVerify',
      meta: { title: '班组长审核' }
    }
  ]
}
export default tableRouter
