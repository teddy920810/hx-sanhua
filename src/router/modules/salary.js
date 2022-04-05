/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/salary',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'SalaryManage',
  meta: {
    title: '工资管理',
    icon: 'nav_icon3'
  },

  children: [
    {
      path: 'output-value-setting',
      component: () => import('@/views/user/index'),
      name: 'OutputValueSetting',
      meta: { title: '产值设置' }
    },
    {
      path: 'salary-verify',
      component: () => import('@/views/user/index-requests'),
      name: 'SalaryVerify',
      meta: { title: '工资审核' }
    },
    {
      path: 'salary-export',
      component: () => import('@/views/user/index-requests'),
      name: 'SalaryExport',
      meta: { title: '工资表导出' }
    }
  ]
}
export default tableRouter
