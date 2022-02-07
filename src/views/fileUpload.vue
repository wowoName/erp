<!--  -->
 <template>
  <div class="upload-con">
    <el-button @click="getFile()" size="small">上传吧</el-button>
    <br><br>
    <el-upload ref="upload" class="upload-demo" drag :on-change="selectedFile" :limit="1" :auto-upload="false">
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
        formData.append("file", state.fileList[0].raw);
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
      /**
       * 文件上传
       */
      handlerUpload(params) {
        var self = this,
          file = params.file,
          fileType = file.type,
          isImage = fileType.indexOf('image') != -1,
          isVideo = fileType.indexOf('video') != -1,
          file_url = self.$refs.upload.uploadFiles[0].url;

        var isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          _.$alert('上传图片或视频大小不能超过 2MB!', '提示', { type: 'error' });
          self.$refs.upload.uploadFiles = [];
          return;
        }
      }
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