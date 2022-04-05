<template>
  <div class="app-container">
    <div class="page-text">招标通告</div>
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        标书上传
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="项目名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          {{ row.status | statusFilter }}
        </template>
      </el-table-column>
      <el-table-column label="在场人数">
        <template slot-scope="{row}">
          <span>{{ row.percent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="暂离场人数">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目开始时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.begin | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目结束时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发包单位">
        <template slot-scope="{row}">
          <span>{{ row.provider }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目地区">
        <template slot-scope="{row}">
          <span>{{ row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目进度">
        <template slot-scope="{row}">
          <span>{{ row.percent * 100 }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" @click="handleGroups(row)">
            班组
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />

  </div>
</template>

<script>
import { fetchList, createData, updateData, deleteData } from '@/api/project-rest'
import Pagination from '@/components/Pagination'

const statusOptions = [
  { key: 'ACTIVE', display_name: '进行中' },
  { key: 'DRAFT', display_name: '未开始' },
  { key: 'END', display_name: '已结束' }
]
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        ACTIVE: '进行中',
        DRAFT: '未开始',
        END: '已结束'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      statusOptions,
      listQuery: {
        name: '',
        status: undefined
      },
      pageQuery: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
      if (query.name && !query.name.includes('*')) {
        query.name = query.name + '*'
      }
      if (query.provider && !query.provider.includes('*')) {
        query.provider = query.provider + '*'
      }
      return query
    },
    handleFilter() {
      this.pageQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.$router.push({ name: 'BiddingNoticePublish' })
    },
    handleDelete(row) {
      this.$confirm('Confirm to remove the data?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        await deleteData(row.id).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
      }).catch(err => { console.error(err) })
    }
  }
}
</script>
