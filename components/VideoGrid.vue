<style lang="scss" scoped>
.vid {
  height: 0;
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  width: 100%;
  z-index: 2;
}
video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
<template>
  <div class="row">
    <div class="col-md-4 mb-3" v-for="video in videos">
      <Video :video="video" :key="`${video.name}-video`" />
    </div>
  </div>
</template>

<script>
import Video from '~/components/Video'
import videos from '~/assets/data/videos.json'

export default {
  components: {
    Video
  },

  computed: {
    videos: () => videos
  }
}

</script>
