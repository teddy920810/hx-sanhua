/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/bidding',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'BiddingManage',
  meta: {
    title: '招标管理',
    icon: 'nav_icon4'
  },
  children: [
    {
      path: 'bidding-notice',
      component: () => import('@/views/bidding/index'),
      name: 'BiddingNotice',
      meta: { title: '招标公告' }
    },
    {
      path: 'bidding-notice-publish',
      component: () => import('@/views/bidding/create'),
      name: 'BiddingNoticePublish',
      meta: { title: '发布招标' },
      hidden: true
    },
    {
      path: 'register-info',
      component: () => import('@/views/bidding/index'),
      name: 'RegisterInfo',
      meta: { title: '报名信息' }
    }
  ]
}
export default tableRouter
