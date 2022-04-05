<template>
  <div class="app-container">
    <div class="page-text">项目信息维护</div>
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="状态" style="width: 200px;" clearable class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.provider" placeholder="发包单位" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.region" placeholder="项目地区" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增项目
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="margin-left:10px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="temp.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="key">
              <el-select v-model="temp.status" placeholder="状态" clearable>
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发包单位" prop="provider">
              <el-input v-model="temp.provider" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目地区" prop="region">
              <el-input v-model="temp.region" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="begin">
              <el-date-picker v-model="temp.begin" type="date" :end-placeholder="temp.end+''" placeholder="选择日期" value-format="timestamp" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="end">
              <el-date-picker v-model="temp.end" type="date" :start-placeholder="temp.begin+''" placeholder="选择日期" value-format="timestamp" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          完成
        </el-button>
      </div>
    </el-dialog>

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
        provider: '',
        region: '',
        status: undefined
      },
      pageQuery: {
        page: 1,
        size: 10
      },
      temp: {
        id: undefined,
        begin: '',
        comment: '',
        count: '',
        end: '',
        name: '',
        provider: '',
        region: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改项目',
        create: '新增项目'
      },
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
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
    resetTemp() {
      this.temp = {
        id: undefined,
        begin: '',
        comment: '',
        count: '',
        end: '',
        name: '',
        provider: '',
        region: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateData(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
    },
    handleGroups(row) {
      this.$router.push({ name: 'GroupsManage', query: { project: JSON.stringify(row) }})
    }
  }
}
</script>
