<template>
  <div class="app-container">
    <div class="page-text">发布招标</div>
    <div class="banner-info"><svg-icon icon-class="setting_info" style="margin-left: 26px;margin-right: 10px" />招标标题</div>
    <div class="banner-form">
      <el-form :model="formData" label-width="150px" label-position="left">
        <el-form-item label="小程序封面图">
          <div class="upload-container">
            <el-upload
              class="image-uploader"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImageUpload"
              :http-request="clickUp"
            >
              <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
              <div v-else>
                <i class="el-icon-upload" /><em>上传图片</em>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="小程序封面链接">
          <el-input v-model="formData.bannerUrl" placeholder="请输入banner链接" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="formStatus==='create'?createData():updateData()">
            保 存
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="banner-info"><svg-icon icon-class="setting_info" style="margin-left: 26px;margin-right: 10px" />招标内容</div>

    <div class="banner-form">
      <el-form :model="formData" label-position="left">
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="formData.content" :height="400" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="formStatus==='create'?createData():updateData()">
            保 存
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { uploadFile, getFile } from '@/api/file'
import store from '@/store'
export default {
  components: { Tinymce },
  data() {
    return {
      formStatus: 'create',
      formData: {
        imageUrl: '',
        bannerUrl: '',
        content: ''
      },
      upFile: undefined
    }
  },
  methods: {
    handleImageSuccess() {
    },
    beforeImageUpload(file) {
      this.upFile = new FormData()
      if (file) {
        this.upFile.append('file', file)
        this.upFile.append('name', file.name)
      }
    },
    createData() {
      store.dispatch('user/refreshToken')
    },
    updateData() {
    },
    clickUp() {
      const fileList = this.upFile
      uploadFile(fileList).then(response => {
        if (response && response.code === 200) {
          getFile(response.body).then(response => {
            const src = window.URL.createObjectURL(response)
            this.formData.imageUrl = src
          })
        }
      })
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
