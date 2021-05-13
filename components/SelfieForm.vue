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
  // background-repeat: no-repeat;
  // background-position: 2rem center;

  &.take-photo {
    @include background-icon-left('~assets/images/take-photo.svg');
  }

  &.retake-photo {
    @include background-icon-left('~assets/images/retake-photo.svg');
  }

  &.upload-photo {
    @include background-icon-left('~assets/images/upload-photo.svg');
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

#box {
   width: 100%;
   padding-bottom: 100%;
   color: #FFF;
   position: relative;
}
#inner-content {
   bottom: 0px;
   left: 0px;
   position: absolute;
   right: 0px;
   top: 0px;

   .text {
    @include font-size(40px);
    font-family: $headings-font-family;
    line-height: 0.93;
    padding-bottom: 5rem !important;

    @include media-breakpoint-down(sm) {
      padding-bottom: 4rem !important;
    }
   }

   .url {
      bottom: 2rem;
      left: 3rem;
      position: absolute;

      @include media-breakpoint-down(sm) {
        bottom: $spacer;
        left: $spacer;
      }
   }
}

.preview-container {
  overflow: hidden;
  position: relative;

  .placeholder-text {
    font-family: $font-family-sans-serif;
  }

  video {
    animation: blur-in 2s;
    bottom: 0;
    height: 100%;
    left: 0;
    object-fit: cover;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 2;
  }
}

.is-step:before {
  @include border-radius($border-radius);
  background-color: theme-color(primary);
  color: theme-color("dark");
  content: '2';
  height: $spacer * 2;
  left: -$spacer;
  padding-top: 0.35rem;
  position: absolute;
  text-align: center;
  top: $spacer * 2;
  width: $spacer * 2;
}

.btn.is-step {
  position: relative;

  &:before {
    @include font-size($font-size-base);
    top: calc(50% - #{$spacer});
  }
}

.comments {
  flex-grow: 1;
  position: relative;

  &:before {
    content: '1';
  }

  label {
    text-align: left;
    display: block;
    border-bottom: 1px solid #000;
  }

  textarea {
    @include font-size(28px);
    @include border-radius(0);
    border: none;
    color: #121212;
    height: calc(100% - 2rem);
    line-height: 1.07;
  }

  small {
    text-transform: uppercase;
    display: block;
    text-align: left;
    margin-top: 10px;
  }
}

.btn-md {
  font-size: 28px;
}

.btn-submit {
  @include background-icon-right('~/assets/images/arrow-down.svg', $spacer * 7, 1rem);
  padding-left: $spacer * 3;

  &:before {
    background-color: theme-color("dark-red");
    background-position: center $spacer * 1.5;
    border-radius: $border-radius;
    background-size: $spacer * 3;
    right: 0;
  }

  @include media-breakpoint-down(md) {
    @include font-size(1.5rem);
    padding-left: $spacer * 1.5;
    padding-right: $spacer * 5;
    &:before {
      background-size: $spacer;
      width: $spacer * 5;
      background-size: $spacer * 1.5;
      background-position: center;
    }
  }
}

.preview-container,
.comments {
  border-radius: 15px !important;
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

      .row.mb-3
        .col-md-6
          .preview-container.selfie-container.bg-primary.rounded-sm.mb-3.mb-md-0#box(
            ref="shareable"
            @click="clickPreview"
            :style="{ width: previewWidth, height: previewHeight }"
          )
            #inner-content
              .bg(:style="selfieBackground")
              .d-flex.h-100(:class="comment == '' ? 'align-items-center placeholder-text text-darkest-red text-center' : 'align-items-end text-white text-uppercase'")
                .text.p-3.p-md-5 {{ displayableComment }}
              .url.text-white ProtestAmazon.org
              //- This always needs to be present in the DOM, but should only be
                    visible if there's a video stream
              video(v-show="videoStream" ref="liveView" autoplay)

        .col-md-6.d-md-flex.flex-column.pl-md-5
          .bg-white.rounded-sm.p-3.p-md-5.mx-2.mb-3.comments.is-step
            textarea.form-control(
              v-model.trim="comment"
              :placeholder="$t('comment_placeholder')"
              :maxlength="maxCommentLength"
            )
            small.d-block {{ $tc('character_count', charactersLeft) }}
          div(v-if="hasWebcam")
            a.btn.btn-block.rounded-sm.btn-md.bg-white.text-dark.is-step.mb-1(
              href="#none"
              @click.prevent="openFilePicker()"
              :disabled="isCapturing"
            )
              span.selfie-button-icon.upload-photo {{ $t('upload_button') }}

            p.text-center.text-white.mb-1 OR

            a.btn.btn-block.rounded-sm.btn-md.btn-primary(
              href="#none"
              @click.prevent="startLiveView()"
              :disabled="isCapturing"
            )
              span.selfie-button-icon(:class="captureButtonIcon")
                | {{ captureButtonText }}

          //- no webcam
          div(v-else)
            //- mobile UI. File picker will include camera option
            .d-block.d-md-none
              a.btn.btn-block.rounded-sm.btn-md.bg-white.text-dark.is-step.mb-1(
                href="#none"
                @click.prevent="openFilePicker()"
                :disabled="isCapturing"
              )
                span.selfie-button-icon.upload-photo {{ $t('upload_button') }}

              p.text-center.text-white.mb-1 OR

              a.btn.btn-block.rounded-sm.btn-md.btn-primary.mb-3(
                href="#none"
                @click.prevent="startLiveView()"
                :disabled="isCapturing"
              )
                span.selfie-button-icon(:class="captureButtonIcon")
                  | {{ captureButtonText }}

            //- desktop UI
            .d-none.d-md-block
              a.btn.btn-block.rounded-sm.btn-md.bg-white.text-dark.is-step(
                href="#none"
                @click.prevent="openFilePicker()"
                :disabled="isCapturing"
              )
                span.selfie-button-icon.upload-photo {{ $t('upload_button_full_width') }}

      .row
        .col-md-6.offset-md-3
          a.btn.btn-block.btn-submit.bg-white.text-primary.text-nowrap.btn-lg.rounded-sm(:disabled="!readyToShare" @click.prevent="createImage()" :class="readyToShare ? '' : 'disabled'")
            span(v-if="isGenerating")
              uppercase {{ $t('generating') }}
            span(v-else)
              uppercase {{ $t('download') }}

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
      originalPhoto: null,
      shareURL: null
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

    displayableComment() {
      return this.comment == '' ? this.$t('comment_blank') : this.comment
    },

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
    } else {
      this.previewWidth = this.$refs.shareable.clientWidth
      this.previewHeight = this.$refs.shareable.clientHeight
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
      this.videoStream = null
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
      // if (this.isGenerating) return

      // this.isGenerating = true

      // await this.createImage()



    },

    async createImage() {
      if (this.isGenerating) return

      this.isGenerating = true

      this.$trackGoal('createSelfie')
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
        this.shareURL = URL.createObjectURL(blob)
        document.body.removeChild(clone)
        this.download()
        this.isGenerating = false
      }, 'image/png')

    },

    download() {
      var a = document.createElement("a")
      a.href = this.shareURL
      a.setAttribute("download", 'share-image.png')
      a.click()
    }
  }
}
</script>
