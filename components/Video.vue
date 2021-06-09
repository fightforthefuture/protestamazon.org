<style lang="scss" scoped>
.video-wrapper {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .fade-out-overlay {
    animation: fade-out .5s;
    animation-fill-mode: forwards;
  }
}
.video-overlay {
  bottom: 0;
  color: theme-color(primary);
  font-size: $small-font-size;
  left: 0;
  right: 0;
  top: 0;
  pointer-events: none;
  position: absolute;
  text-align: center;
  z-index: 10;

  .play {
    left: 0;
    position: absolute;
    right: 0;
    top: 30%;

    img {
      cursor: pointer;
      margin-bottom: 5px;
      transition: $btn-transition, transform .4s;
      width: 65px;

      &:hover {
        transform: scale(1.02);
      }

      @include media-breakpoint-down(sm) {
        width: 30px;
      }
    }
  }
}

.clickable-overlay {
  background:rgba(theme-color("dark"), 0.5);
  bottom:0;
  display:block;
  left:0;
  position: absolute;
  right:0;
  top:0;
  z-index: 1;
}

.video-container {
  background-color: rgba(0, 0, 0, 1);
  height: 0;
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  width: 100%;

  video,
  img,
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  img {
    transition: transform .4s;
  }

  a:hover img {
    transform: scale(1.02);
  }
}

@include media-breakpoint-down(sm) {
  .video-overlay {
    .play {
      img {
        width: 50px;
      }
    }
  }
}
</style>
<template>
  <div class="video-wrapper position-relative">
    <div class="video-container">
      <a v-show="isOverlayVisible" href="#" @click.prevent="hideOverlay()" class="clickable-overlay"></a>
      <video controls ref="vid">
        <source :src="video.url" :type="video.type">
      </video>
    </div>
    <div class="video-overlay d-flex" :class="isOverlayVisible ? '' : 'fade-out-overlay'" @click.prevent="hideOverlay()">
      <div class="play">
        <img src="~assets/images/icon-play.png" alt="Play" @click.prevent="hideOverlay()" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    video: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isOverlayVisible: true
    }
  },

  methods: {
    hideOverlay() {
      this.isOverlayVisible = false
      this.$refs.vid.play()
    }
  }
}

</script>
