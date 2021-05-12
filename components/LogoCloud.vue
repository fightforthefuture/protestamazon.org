<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.bg-white {
  height: 5rem;

  img {
    max-width: 80%;
    max-height: 80%;
  }
}

.rounded-xs {
  @include border-radius(5px);
}
</style>

<template lang="pug">
  ul.row
    li.col-6.col-sm-3(v-for="logo in logos").py-2.pr-2
      .border.border-gray-light.bg-white.rounded-xs.d-flex.mb-2
        .d-flex.align-items-center.justify-content-center
          img(:src="logo.image_url" :alt="`${logo.name} logo`")
</template>

<script>
import logos from '~/assets/data/logos.json'

export default {
  computed: {
    logos: () => logos
  }
}
</script>
