<template>
  <div class="app-container">
    <div class="page-text">{{ project.name }}-班组管理</div>
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增班组
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="班组名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班组长">
        <template slot-scope="{row}">
          <span>{{ row.leader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目">
        <span>{{ project.name }}</span>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createAt | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
            <el-form-item label="班组名称" prop="name">
              <el-input v-model="temp.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组长" prop="leader.id">
              <el-autocomplete v-model="temp.leader.name" value-key="name" :fetch-suggestions="querySearchUser" placeholder="请输入内容" @select="handleSelectUser" />
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
import { fetchList, createData, updateData, deleteData, findById } from '@/api/group-rest'
import { search } from '@/api/user-rest'
import Pagination from '@/components/Pagination'

const statusOptions = [
  { key: 'ACTIVE', display_name: 'ACTIVE' },
  { key: 'DRAFT', display_name: 'DRAFT' }
]
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        ACTIVE: 'ACTIVE',
        DRAFT: 'DRAFT'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      project: undefined,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      statusOptions,
      listQuery: {
        name: ''
      },
      pageQuery: {
        page: 1,
        size: 10
      },
      temp: {
        id: undefined,
        name: '',
        leader: {
          id: undefined,
          name: ''
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改班组',
        create: '新增班组'
      },
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        'leader.id': [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.project = JSON.parse(this.$route.query.project)
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery['project.id'] = this.project.id
      const query = Object.assign({}, this.listQuery)
      if (query.name && !query.name.includes('*')) {
        query.name = query.name + '*'
      }
      fetchList(query, this.pageQuery).then(response => {
        if (response && response.code === 200) {
          this.list = response.body.content
          this.total = response.body.total
          this.listLoading = false
        }
      })
    },
    handleFilter() {
      this.pageQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        leader: {
          id: undefined,
          name: ''
        },
        project: {
          id: this.project.id
        }
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
      findById(row.id).then(res => {
        this.temp = res.body
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateData(tempData).then(res => {
            if (res) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('Confirm to remove the data?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteData(row.id)
          this.getList()
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    querySearchUser(queryString, cb) {
      search({ name: queryString + '*' }).then(res => {
        console.log(res.body)
        cb(res.body)
      })
    },
    handleSelectUser(item) {
      this.temp.leader = item
    }
  }
}
</script>
