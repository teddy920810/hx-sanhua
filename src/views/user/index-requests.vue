<template>
  <div class="app-container">
    <div class="page-text">班组长审核</div>
    <div class="filter-container">
      <el-input v-model="listQuery['userInfo.name']" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="姓名">
        <template slot-scope="{row}">
          <span>{{ row.userInfo.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="{row}">
          <span>{{ row.userInfo.gender | sexFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="{row}">
          <span>{{ row.userInfo.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证">
        <template slot-scope="{row}">
          <span>{{ row.userInfo.idNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族">
        <template slot-scope="{row}">
          <span>{{ row.userInfo.nation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="{row}">
          <span>{{ row.userInfo.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目">
        <template slot-scope="{row}">
          <span>{{ row.group.project.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="{row}">
          <span>{{ row.userInfo.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班组名称">
        <template slot-scope="{row}">
          <span>{{ row.group.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleApply(row, 'agree')">
            同意
          </el-button>
          <el-button size="mini" type="danger" @click="handleApply(row, 'disagree')">
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, applyData } from '@/api/requests-rest'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        ACTIVE: 'ACTIVE',
        REMOVE: '已删除'
      }
      return statusMap[status]
    },
    sexFilter(gender) {
      const genderMap = {
        MALE: '男',
        FEMALE: '女',
        UNSET: '保密'
      }
      return genderMap[gender]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      allProjects: [],
      allGroups: [],
      allWorkType: [],
      groupOptions: [],
      listQuery: {
        'userInfo.name': undefined
      },
      pageQuery: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.initData()
    this.getList()
  },
  methods: {
    initData() {
    },
    getList() {
      this.listLoading = true
      fetchList(this.fuzzyQuery(), this.pageQuery).then(response => {
        if (response && response.code === 200) {
          this.list = response.body.content
          this.total = response.body.total
          this.listLoading = false
        }
      })
    },
    fuzzyQuery() {
      const query = Object.assign({}, this.listQuery)
      if (query['userInfo.name'] && !query['userInfo.name'].includes('*')) {
        query['userInfo.name'] = query['userInfo.name'] + '*'
      }
      return query
    },
    handleFilter() {
      this.pageQuery.page = 1
      this.getList()
    },
    handleApply(row, status) {
      console.log(row, status)
      applyData().then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .pro-item {
    margin-bottom: 20px;
    &:last-child {
     margin-bottom: 0;
    }
    .el-input {
      margin-bottom: 5px;
      margin-right: 2px;
    }
  }
</style>
