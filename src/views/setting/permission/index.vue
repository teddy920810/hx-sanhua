<template>
  <div class="app-container">
    <div class="page-text">权限管理</div>
    <div class="banner-form">
      <el-form :model="formData" label-width="150px" label-position="left">
        <el-form-item label="角色名称">
          <el-select v-model="formData" value-key="id" placeholder="请选择" @change="selectRole()">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <div style="border-radius: 4px;border: 1px solid #BBBBBB;width: 80%;">
            <div v-for="(perZ,i) in permissionOptions" :key="i">
              <el-checkbox v-model="perZ.checkAll" style="background: #F3F3F3;height: 51px;width: 100%;line-height: 51px;padding: 0 14px;" :indeterminate="perZ.isIndeterminate" @change="handleCheckAllChange(perZ)">
                {{ perZ.name }}</el-checkbox>
              <div style="margin: 15px 0;" />
              <el-checkbox-group v-model="perZ.checkedPer" style="width: 100%;padding: 0 14px;" @change="handleCheckedPermissionChange(perZ)">
                <el-checkbox v-for="item in perZ.children" :key="item.key" :label="item">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateData()">
            保 存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchList as getRoles, updateData } from '@/api/role-rest'
export default {
  data() {
    return {
      roleList: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      formData: {
        role: '',
        permissions: []
      },
      permissionOptions: [
        {
          key: 'A',
          name: '项目管理',
          checkAll: false,
          isIndeterminate: false,
          checkedPer: [],
          children: [
            {
              key: 1,
              name: '项目信息维护'
            },
            {
              key: 2,
              name: '项目状态管理'
            },
            {
              key: 3,
              name: '班组管理'
            }
          ]
        },
        {
          key: 'B',
          name: '工人管理',
          checkAll: false,
          isIndeterminate: false,
          checkedPer: [],
          children: [
            {
              key: 11,
              name: '人员信息维护'
            },
            {
              key: 12,
              name: '数据导入统计'
            },
            {
              key: 13,
              name: '数据分析'
            }
          ]
        },
        {
          key: 'C',
          name: '工资管理',
          checkAll: false,
          isIndeterminate: false,
          checkedPer: [],
          children: [
            {
              key: 21,
              name: '工资审核'
            },
            {
              key: 22,
              name: '产值设置'
            },
            {
              key: 23,
              name: '工资表导出'
            }
          ]
        },
        {
          key: 'D',
          name: '招标管理',
          checkAll: false,
          isIndeterminate: false,
          checkedPer: [],
          children: [
            {
              key: 31,
              name: '招标公告'
            },
            {
              key: 32,
              name: '报名信息查询'
            },
            {
              key: 33,
              name: '中标管理'
            },
            {
              key: 34,
              name: '信息导出'
            }
          ]
        },
        {
          key: 'E',
          name: '系统设置',
          checkAll: false,
          isIndeterminate: false,
          checkedPer: [],
          children: [
            {
              key: 91,
              name: '权限设置'
            },
            {
              key: 92,
              name: '角色管理'
            },
            {
              key: 93,
              name: '字典管理'
            },
            {
              key: 94,
              name: 'banner图上传'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getRoles({}).then(res => {
        this.roleList = res.body
      })
    },
    updateData() {
      let ff = []
      for (let i = 0; i < this.permissionOptions.length; i++) {
        ff = ff.concat(this.permissionOptions[i].checkedPer)
      }
      this.formData.features = ff.map(item => {
        return item.key
      })
      const tempData = Object.assign({}, this.formData)
      updateData(tempData).then(() => {
        this.initData()
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleCheckAllChange(val) {
      this.$set(val, 'checkedPer', val.checkAll ? val.children : [])
      val.isIndeterminate = false
    },
    handleCheckedPermissionChange(val) {
      const checkedCount = val.checkedPer.length
      val.checkAll = checkedCount === val.children.length
      val.isIndeterminate = checkedCount > 0 && checkedCount < val.children.length
    },
    selectRole() {
      for (let i = 0; i < this.permissionOptions.length; i++) { // 切换选择时，初始化选中数据
        this.permissionOptions[i].checkedPer = []
        this.permissionOptions[i].checkAll = false
        this.permissionOptions[i].isIndeterminate = false
      }
      if (this.formData && this.formData.features && this.formData.features.length > 0) {
        for (let i = 0; i < this.permissionOptions.length; i++) {
          for (let j = 0; j < this.permissionOptions[i].children.length; j++) {
            if (this.formData.features.includes(this.permissionOptions[i].children[j].key)) {
              this.permissionOptions[i].checkedPer.push(this.permissionOptions[i].children[j])
              this.handleCheckedPermissionChange(this.permissionOptions[i])
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 35%;
    float: left;
  }
}
.banner-info {
  width: 100%;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  background: #F7F7F7;
  color: #333333;
}
.banner-form {
  padding: 30px;
  min-height: 600px;;
  height: calc(100% - 72px);
}
</style>
