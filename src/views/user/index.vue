<template>
  <div class="app-container">
    <div class="page-text">人员信息维护</div>
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.role" placeholder="角色" style="width: 200px;" clearable class="filter-item">
        <el-option v-for="item in allRoles" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
      <el-select v-model="listQuery.projectIds" placeholder="所属项目" style="width: 200px;" clearable multiple class="filter-item" @keyup.enter.native="handleFilter" @change="proChang(listQuery.projectIds)">
        <el-option v-for="item in allProjects" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.groupIds" placeholder="所属班组" style="width: 200px;" clearable multiple class="filter-item" @keyup.enter.native="handleFilter">
        <el-option v-for="item in allGroups" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        新增用户
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit stripe highlight-current-row style="width: 100%;">
      <el-table-column label="姓名">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="{row}">
          <span>{{ row.gender | sexFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="{row}">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证">
        <template slot-scope="{row}">
          <span>{{ row.idNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族">
        <template slot-scope="{row}">
          <span>{{ row.nation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目">
        <template slot-scope="{row}">
          <span v-for="(p, i) in row.projectNames" :key="i">{{ p }}、</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班组名称">
        <template slot-scope="{row}">
          <span v-for="(p, i) in row.groupNames" :key="i">{{ p }}、</span>
        </template>
      </el-table-column>
      <el-table-column label="工种">
        <template slot-scope="{row}">
          <span>{{ row.workType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="输入系统状态">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            恢复
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            停用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="140px" style="margin-left:10px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="temp.gender" placeholder="请选择">
                <el-option label="男" value="MALE" />
                <el-option label="女" value="FEMALE" />
                <el-option label="保密" value="UNSET" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="temp.age" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idNo">
              <el-input v-model="temp.idNo" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-input v-model="temp.nation" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="region">
              <el-input v-model="temp.region" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="projectNames">
              <el-autocomplete v-model="temp.projectObj.name" value-key="name" :fetch-suggestions="querySearchProject" placeholder="请输入" @select="handleSelectProject" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="temp.phone" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="班组名称" prop="groupNames">
              <el-select v-model="temp.groupObj" placeholder="请选择" clearable>
                <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工种" prop="workType">
              <el-input v-model="temp.workType" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-input v-model="temp.role" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订劳动合同情况" prop="region">
              <el-input v-model="temp.comment" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="temp.comment" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="项目履历" prop="provider">
          <el-row v-for="(p, i) in projects" :key="i" class="pro-item">
            <el-col :span="8"><el-date-picker v-model="p.monthrange" type="monthrange" range-separator="至" start-placeholder="工作开始月份" end-placeholder="工作结束月份" value-format="timestamp" @change="selectData(p)" /></el-col>
            <el-col :span="8"><el-input v-model="p.workIn" placeholder="请输入公司名称" /></el-col>
            <el-col :span="8"><el-input v-model="p.experience" placeholder="请输入项目经历" /></el-col>
            <el-col :span="8"><el-input v-model="p.bankName" placeholder="请输入工资卡所属银行" /></el-col>
            <el-col :span="8"><el-input v-model="p.bankCardNo" placeholder="请输入工资卡银行卡号" /></el-col>
            <el-col :span="8"><el-button type="danger" icon="el-icon-delete" circle @click="delPro(i)" /></el-col>
          </el-row>
          <el-button type="primary" @click="addPro">新增项目履历</el-button>
        </el-form-item>
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
import { fetchList, createData, updateData, deleteData } from '@/api/user-rest'
import { search as proSearch } from '@/api/project-rest'
import { search as groupSearch } from '@/api/group-rest'
import { search as treeSearch } from '@/api/trees-rest'
import { fetchList as roleSearch } from '@/api/role-rest'
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
      allRoles: [],
      allProjects: [],
      allGroups: [],
      allWorkType: [],
      groupOptions: [],
      listQuery: {
        name: undefined
      },
      pageQuery: {
        page: 1,
        size: 10
      },
      temp: {
        id: undefined,
        projectObj: {},
        groupObj: {},
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
        update: '修改用户',
        create: '新增用户'
      },
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      projects: [
        {
          monthrange: '',
          bankCardNo: '',
          bankName: '',
          begin: '',
          end: '',
          experience: '',
          workIn: ''
        }
      ]
    }
  },
  created() {
    this.initData()
    this.getList()
  },
  methods: {
    initData() {
      proSearch({ name: '' }).then(res => {
        this.allProjects = res.body
        groupSearch({ 'project.id': this.allProjects[0].id }).then(res => {
          this.allGroups = res.body
        })
      })
      treeSearch({ 'value': 'WORK_TYPE', '-parentId': 0 }).then(res => {
        this.allWorkType = res.body
      })
      roleSearch({}).then(res => {
        this.allRoles = res.body
      })
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
      if (query.name && !query.name.includes('*')) {
        query.name = query.name + '*'
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
        projectObj: {},
        groupObj: {},
        signed: true,
        source: 'PORTAL',
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
    copyTemp() {
      const tempData = {
        address: this.temp.address,
        age: parseInt(this.temp.age),
        gender: this.temp.gender,
        groupIds: [this.temp.groupObj.id],
        groupNames: [this.temp.groupObj.name],
        idNo: this.temp.idNo,
        name: this.temp.name,
        nation: this.temp.nation,
        phone: this.temp.phone,
        projectIds: [this.temp.projectObj.id],
        projectNames: [this.temp.projectObj.name],
        signed: this.temp.signed,
        source: this.temp.source,
        workType: {
          id: 2
        },
        histories: this.projects
      }
      return tempData
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            address: this.temp.address,
            age: parseInt(this.temp.age),
            gender: this.temp.gender,
            groupIds: [this.temp.groupObj.id],
            groupNames: [this.temp.groupObj.name],
            idNo: this.temp.idNo,
            name: this.temp.name,
            nation: this.temp.nation,
            phone: this.temp.phone,
            projectIds: [this.temp.projectObj.id],
            projectNames: [this.temp.projectObj.name],
            signed: true,
            source: 'PORTAL',
            workType: {
              id: 2
            },
            histories: this.projects
          }
          createData(tempData).then(() => {
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
      this.temp.timestamp = new Date(this.temp.timestamp)
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
    addPro() {
      this.projects.push({ monthrange: '',
        bankCardNo: '',
        bankName: '',
        begin: '',
        end: '',
        experience: '',
        workIn: '' })
    },
    delPro(index) {
      this.projects.splice(index, 1)
    },
    querySearchProject(queryString, cb) {
      proSearch({ name: queryString + '*' }).then(res => {
        cb(res.body)
      })
    },
    handleSelectProject(item) {
      this.temp.projectObj = item
      groupSearch({ 'project.id': item.id }).then(res => {
        this.groupOptions = res.body
      })
    },
    selectData(p) {
      p.begin = p.monthrange[0]
      p.end = p.monthrange[1]
    },
    proChang(pids) {
      groupSearch({ 'project.id': pids }).then(res => {
        this.allGroups = res.body
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
