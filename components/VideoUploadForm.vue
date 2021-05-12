<style lang="scss" scoped>
  .upload-video {
    @include background-icon-left('~assets/images/upload-video.png');
  }
</style>
<template>
  <form class="text-left" @submit.prevent="uploadFile()">
    <p v-if="videoErrorMessage" class="text-warn text-center mb-5">
      {{ videoErrorMessage }}
    </p>

    <div v-if="!hasSubmitted">
      <input v-show="false"
             @change="uploadFile"
             type="file"
             accept="video/*"
             capture="user"
             ref="fileInput"
             id="video_file"
             name="video_file" />
      <div class="rounded border d-flex flex-row align-items-center">
        <div class="col-12 col-md-6 px-3 px-md-5">
          <small>
            By submitting this video you are granting us the right to use it for promotional purposes. <a href="https://www.fightforthefuture.org/privacy/" target="_blank">Privacy Policy</a> and <a href="https://www.fightforthefuture.org/privacy/" target="_blank">Terms of Service</a>
          </small>
        </div>
        <div class="col-12 col-md-6">
          <button class="btn btn-block btn-primary btn-lg btn-cta rounded" @click.prevent="openFilePicker()">
            <span class="upload-video"><uppercase>Upload video</uppercase></span>
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        isSending: false,
        hasSubmitted: false,
        videoErrorMessage: null
      }
    },

    methods: {
      openFilePicker() {
        this.$refs.fileInput.click()
      },

      async uploadFile() {
        this.hasSubmitted = false
        if (this.isSending) return

        this.isSending = true
        this.videoErrorMessage = null

        const file = this.$refs.fileInput.files[0]

        if (!file.type.match(/^video/)) {
          this.videoErrorMessage = 'Invalid file type. Please choose another file.'
        }

        const formData = new FormData()
        formData.append('video', file, file.name)

        const { data } = await this.$axios.post('https://uploads.fightforthefuture.org', formData)
        console.log(data)

        this.isSending = false

        if (data.success == true) {
          this.$trackEvent('uploadVideo')
          this.hasSubmitted = true
        } else {
          this.videoErrorMessage = 'There was an error submitting your video. Please try again.'
        }
      }

    }
  }
</script>
