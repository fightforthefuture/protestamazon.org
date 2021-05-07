<template>
  <form class="text-left" @submit.prevent="uploadFile()">
    <p v-if="errorMessage" class="text-warn text-center mb-5">
      {{ errorMessage }}
    </p>

    <div v-if="hasSubmitted" class="sml-pad-y3 sml-pad-y-top0">
      <h2 class="text-primary">Thanks!</h2>
      <p class="intro">Your video has been received. Check back on June 10 to see all the action.</p>
    </div>
    <div v-if="!hasSubmitted">
      <div class="row sml-push-y1">
        <div class="sml-c12 lrg-c6 sml-pad-y1">
          <label for="video_file">Upload video:</label>
          <input type="file" accept="video/*" capture="user" ref="fileInput" id="video_file" name="video_file" />
        </div>
      </div>

      <button class="btn btn-block btn-primary btn-cta sml-push-y2">
        Submit
      </button>

      <small class="text-purple sml-push-y1">
        By submitting this video you are granting us the right to use it for promotional purposes. <a href="https://www.fightforthefuture.org/privacy/" target="_blank">Privacy Policy</a> and <a href="https://www.fightforthefuture.org/privacy/" target="_blank">Terms of Service</a>
      </small>
    </div>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        isSending: false,
        hasSubmitted: false,
        errorMessage: null
      }
    },

    methods: {
      async uploadFile() {
        this.hasSubmitted = false
        if (this.isSending) return

        this.isSending = true
        this.errorMessage = null

        const file = this.$refs.fileInput.files[0]

        if (!file.type.match(/^video/)) {
          this.errorMessage = 'Invalid file type. Please choose another file.'
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
          this.errorMessage = 'There was an error submitting your video. Please try again.'
        }
      }

    }
  }
</script>
