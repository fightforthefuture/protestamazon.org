<i18n src="~/locales/components/SelfieForm.yml"></i18n>
<i18n src="~/locales/global.yml"></i18n>

<style lang="scss" scoped>
@keyframes blur-in {
  0% {
    opacity: 0;
    filter:blur(25px);
  }
  100% {
    opacity: 1;
    filter:blur(0px);
  }
}

.selfie-button-icon {
  background-repeat: no-repeat;
  background-position: left center;

  &.take-photo {
    background-size: 22px auto;
    padding-left: 28px;
    background-image: url(~assets/images/take-photo.svg);
  }

  &.retake-photo {
    background-size: 15px auto;
    padding-left: 20px;
    background-image: url(~assets/images/retake-photo.svg);
  }

  &.upload-photo {
    background-size: 16px auto;
    padding-left: 22px;
    background-image: url(~assets/images/upload-photo.svg);
  }
}

.btn-outline-primary {
  border: 1px solid theme-color(primary);
  color: theme-color(primary);

  &:hover,
  &:active {
    color: #fff;
  }
}

.preview-container {
  overflow: hidden;
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: blur-in 2s;
  }

  .overlay {
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
  }
}

.comments {
  position: relative;

  @include media-breakpoint-up(md) {
    height: 423px;
  }

  label {
    text-align: left;
    display: block;
    border-bottom: 1px solid #000;
  }

  textarea {
    @include media-breakpoint-up(md) {
      height: 77%;
    }

    font-size: 32px;
    line-height: 0.95;
    font-family: $headings-font-family;
    // color: #000;
    text-transform: uppercase;
  }

  small {
    text-transform: uppercase;
    display: block;
    text-align: left;
    margin-top: 10px;
  }
}
</style>

<template lang="pug">
  .selfie-form
    form(v-if="!hasSubmitted" @submit.prevent="submitForm()")
      p.alert-danger.p-3.rounded-sm(v-if="errorMessage") {{ errorMessage }}

      input(v-show="false"
        @change="uploadPhoto"
        ref="fileInput"
        type="file"
        :disabled="isCapturing"
      )

      .row
        .col-md-6
          .bg-white.rounded-sm.p-2.m-2
            .preview-container.mb-1(
              ref="shareable"
              @click="clickPreview"
              :style="{ width: previewWidth, height: previewHeight }"
            )
              img.rounded-sm(v-if="!originalPhoto && !videoStream"
                ref="placeholderImage"
                src="~assets/images/photo-placeholder.svg"
                alt="Your image goes here"
              )
              .selfie-container(v-else-if="originalPhoto")
                .p-3.bg-black
                  .bg(:style="selfieBackground")
                  .text.text-primary {{ comment }}

              //- This always needs to be present in the DOM, but should only be
                  visible if there's a video stream
              video(v-show="videoStream" ref="liveView" autoplay)


            .row(v-if="hasWebcam")
              .col
                a.btn.btn-block.btn-sm.btn-primary(
                  href="#none"
                  @click.prevent="startLiveView()"
                  :disabled="isCapturing"
                )
                  span.selfie-button-icon(:class="captureButtonIcon")
                    | {{ captureButtonText }}
              .col
                a.btn.btn-block.btn-sm.btn-outline-primary(
                  href="#none"
                  @click.prevent="openFilePicker()"
                  :disabled="isCapturing"
                )
                  span.selfie-button-icon.upload-photo {{ $t('upload_button') }}

            //- no webcam
            div(v-else)
              //- mobile UI. File picker will include camera option
              .d-none.d-sm-block.d-md-none
                .row
                  .col
                    a.btn.btn-sm.btn-dark(
                      :class="captureButtonIcon"
                      @click.prevent="openFilePicker()"
                      :disabled="isCapturing"
                    )
                      span.selfie-button-icon(:class="captureButtonIcon")
                        | {{ captureButtonText }}
                  .col
                    a.btn.btn-sm.btn-outline-primary(
                      @click.prevent="openFilePicker()"
                      :disabled="isCapturing"
                    )
                      span.selfie-button-icon.upload-photo {{ $t('upload_button') }}

              //- desktop UI
              .d-sm-none.d-md-block
                a.btn.btn-sm.btn-dark.btn-block(
                  @click.prevent="openFilePicker()"
                  :disabled="isCapturing"
                )
                  span.selfie-button-icon.upload-photo
                    | {{ $t('upload_button_full_width') }}

        .col-md-6
          .bg-white.rounded-sm.p-2.m-2.comments
            label {{ $t('comment_label') }}
            textarea.form-control(
              v-model.trim="comment"
              :placeholder="$t('comment_placeholder')"
              :maxlength="maxCommentLength"
            )
            small.d-block.text-muted {{ $tc('character_count', charactersLeft) }}

      .d-flex.m-1.p-1
        button.btn.btn-block.btn-dark.btn-lg(:disabled="!readyToShare")
          span(v-if="isGenerating") {{ $t('global.common.sending') }}
          span(v-else) {{ $t('download') }}

    audio(ref="countdownSound" preload="auto")
      source(src="/sounds/countdown.mp3")

    audio(ref="shutterSound" preload="auto")
      source(src="/sounds/shutter.mp3")
</template>

<script>
import { createPNG } from '~/assets/js/selfie'
import { isMobileOS } from '~/assets/js/helpers'
import SocialShareButtons from '~/components/SocialShareButtons'

export default {
  components: {
    SocialShareButtons
  },

  data() {
    return {
      videoStream: null,
      previewWidth: '',
      previewHeight: '',
      isCapturing: false,
      captureButtonIcon: 'take-photo',
      captureButtonText: this.$t('take_photo'),
      hasWebcam: false,
      isGenerating: false,
      hasSubmitted: false,
      errorMessage: null,
      comment: '',
      originalPhoto: null
    }
  },

  computed: {
    maxCommentLength() {
      return 140
    },

    charactersLeft() {
      return this.maxCommentLength - (this.comment || '').length
    },

    readyToShare() {
      return !this.isGenerating && this.originalPhoto
    },

    // photoSource: {
    //   get() {
    //     return this.$store.state.selfies.photoSource
    //   },

    //   set(value) {
    //     this.$store.commit('selfies/setPhotoSource', value)
    //   }
    // },

    selfieBackground() {
      if (this.originalPhoto) {
        return `background-image: url('${this.originalPhoto}')`
      } else {
        return ''
      }
    },
  },

  created() {
    this.timers = {}
  },

  async mounted() {
    if (this.$refs.placeholderImage) {
      const self = this
      this.$refs.placeholderImage.onload = function () {
        self.previewWidth = `${this.width}px`
        self.previewHeight = self.previewWidth //`${this.height}px`
        this.onload = null
      }
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(d => d.kind === 'videoinput')

    if (videoDevices.length > 0 && !isMobileOS()) {
      this.hasWebcam = true
    }
  },

  destroyed() {
    this.stopLiveView()

    for (const key of Object.keys(this.timers)) {
      clearTimeout(this.timers[key])
    }
  },

  methods: {
    playSound(name) {
      this.$refs[`${name}Sound`].play()
    },

    handleLiveViewError() {
      this.hasWebcam = false
      this.isCapturing = false
      this.videoStream = null
      this.errorMessage = this.$t('camera_connection_error')
    },

    async startLiveView() {
      // this.photoSource = null
      this.originalPhoto = null

      try {
        const constraits = {
          video: {
            width: 1280,
            height: 720,
            facingMode: 'user'
          },
          audio: false
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraits)

        if (!stream.active) {
          throw new Error('Received inactive video stream')
        }

        // this can't be bound via :srcObject for some reason
        this.$refs.liveView.srcObject = stream

        this.videoStream = stream
        this.isCapturing = true
        this.captureButtonIcon = null
        this.captureButtonText = this.$t('starting')

        // some browsers will just hang forever if your laptop is in clamshell mode
        this.timers.captureFail = setTimeout(() => {
          console.error('Failed to start live view!')
          this.handleLiveViewError()
        }, 5000)

        // start countdown when video is ready
        this.$refs.liveView.oncanplay = () => {
          this.countdown(3)
          clearTimeout(this.timers.captureFail)
        }
      } catch (error) {
        console.error(error)
        this.handleLiveViewError()
      }
    },

    stopLiveView() {
      if (this.videoStream) {
        this.videoStream.getTracks()[0].stop()
      }
    },

    countdown(seconds) {
      if (seconds > 0) {
        this.captureButtonIcon = null
        this.captureButtonText = `${this.$t('ready_in')} ${seconds}…`
        this.playSound('countdown')

        this.timers.countdown = setTimeout(() => {
          this.countdown(seconds-1)
        }, 1000)
      } else {
        this.playSound('shutter')
        this.takePhoto()
      }
    },

    async updatePhotoSource({ source, file }) {
      this.originalPhoto = await createPNG({ sourceElement: source, sourceFile: file })
      this.isCapturing = false
      this.stopLiveView()
      this.captureButtonIcon = 'retake-photo'
      this.captureButtonText = this.$t('retake_photo')
    },

    takePhoto() {
      this.updatePhotoSource({
        source: this.$refs.liveView
      })
      this.$trackClick('take_photo')
    },

    uploadPhoto(event) {
      this.updatePhotoSource({
        file: event.target.files[0]
      })
      this.$trackClick('upload_photo')
    },

    openFilePicker() {
      this.$refs.fileInput.click()
    },

    clickPreview() {
      if (this.hasWebcam) {
        this.startLiveView()
      } else {
        this.openFilePicker()
      }
    },

    async submitForm() {
      if (this.isGenerating) return

      this.isGenerating = true

      await this.createImage()

      this.$trackGoal('createSelfie')
    },

    async createImage() {
      const min_width = this.previewWidth
      const min_height = this.previewHeight

      let clone = this.$refs.shareable.cloneNode(true)
      let text = clone.outerHTML
      clone = document.createElement('div')
      clone.classList.add('canvasable-el')
      clone.innerHTML = text

      document.body.appendChild(clone)

      const canvas = await this.$html2canvas(clone, {
        useCORS: true,
        scale: 1,
        width: this.previewWidth,
        height: this.previewHeight,
        allowTaint: true,
        windowWidth: min_width,
        windowHeight: min_height
      })

      canvas.toBlob(blob => {
        const shareURL = URL.createObjectURL(blob)
        document.body.removeChild(clone)
        window.open(shareURL, "_blank")
        this.isGenerating = false
      }, 'image/png')

    }
  }
}
</script>
