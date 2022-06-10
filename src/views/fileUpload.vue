<!--  -->
 <template>
  <div class="upload-con">
    <el-button @click="getFile()" size="small">上传吧</el-button>
    <br><br>
    <el-upload ref="upload" class="upload-demo" multiple drag :on-change="selectedFile" :limit="2" :auto-upload="false">
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        拖拽或者点击选择
      </div>
    </el-upload>
  </div>
</template>

  <script>
import { reactive, toRefs, ref, toRaw, onMounted, onBeforeUnmount } from 'vue'
import { uploadFile } from '@/api/common'
import { globalLoading, showMessage } from '@/utils'
export default {
  setup(props, context) {
    let state = reactive({
      msg: 'state',
      wMsg: '',
      fileList: []
    })

    const upload = ref(null)

    const methods = {
      getFile() {
        let formData = new FormData()
        // 上传文件
        state.fileList.forEach(v => {
          formData.append('file', v.raw);
        })
        formData.append('name', '我的名字')
        const loading = globalLoading('上传中...')
        uploadFile(formData).then(res => {
          const isSuccess = res.code === 200
          showMessage(isSuccess ? 'success' : 'error', isSuccess ? '上传成功' : res.message)
        }).finally(_ => {
          loading.close()
        })
      },
      /**
       * 文件选择改变
       */
      selectedFile(file, fileList) {
        state.fileList = fileList
      },

    }

    return {
      ...toRefs(state), //抛出
      ...methods,
      upload
    }
  },
}
  </script>
  <style lang='scss' scoped>
.upload-con {
  padding: 50px;
}
.el-upload__text {
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 30px;
  }
}
</style>