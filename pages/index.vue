<style lang="scss">
section:first-child {
  background-color: #A4A4A4;
  background-image: url('~assets/images/header.png');
  background-repeat: no-repeat;
  background-size: 100%;
  padding-top: 10vw;
}

#partners {
  padding-top: $spacer * 5 !important;
  @include media-breakpoint-down(sm) {
    padding-top: $spacer * 2 !important;
  }
}
h1, h2 {
  @include font-size(3.5 * $font-size-base);
  line-height: 0.93;
}

h3 {
  @include font-size(3 * $font-size-base);
}

p {
  @include font-size(20px);
}

.btn:not(.btn-link) {
  font-family: $headings-font-family;

  span {
    display: block;
    padding-top: .25rem;
  }
}

.btn-link {
  @include border-radius(0);
  color: $link-color;
  font-size: inherit;
  line-height: inherit;
  padding: 0;
  &:hover {
    transform: none;
  }
}

.btn-arrow-down {
  @include background-icon-right('~/assets/images/arrow-down.svg', $spacer * 7, 1rem);

  margin: 0 0 -7rem;

  @include media-breakpoint-down(sm) {
    margin-bottom: -4rem;
  }
}
.btn-arrow-right {
  @include background-icon-right('~/assets/images/arrow-right.svg', $spacer * 7, 1rem);
  &:before {
    background-size: $spacer * 4 !important;
    background-position: center $spacer * 1.3 !important;
    @include media-breakpoint-down(sm) {
      background-size: $spacer !important;
    }
  }
}

.btn-arrow-down,
.btn-arrow-right {
  @include font-size(3 * $font-size-base);
  padding-left: $spacer * 3;

  &:before {
    background-color: theme-color("dark-red");
    background-position: center $spacer * 1.5;
    border-radius: $border-radius;
    background-size: $spacer * 3;
    right: 0;

    @include media-breakpoint-down(md) {
      background-position: center $spacer;
    }
  }

  @include media-breakpoint-down(sm) {
    @include font-size(1.5rem);
    padding-left: $spacer * 1.5;
    padding-right: $spacer * 4;

    &:before {
      background-size: $spacer;
      width: $spacer * 3;
      background-position: center;
    }
  }

}

.box {
  margin-bottom: $spacer * 3;

  position: relative;
  &:before {
    @include border-radius($border-radius);
    bottom: 0;
    content: '';
    left: -100%;
    position: absolute;
    right: 0;
    top: 0;
  }

  &.bg-primary:before {
    background-color: theme-color("primary");
  }

  &.bg-alt:before {
    background-color: theme-color("alt");
  }

  img {
    bottom: $spacer * 3;
    height: calc(100% - #{$spacer * 1.5});
    left: 0;
    mix-blend-mode: multiply;
    position: absolute;
    object-fit: cover;
    top: -.5rem;
  }

  .col-3 {
    &:after {
      background-color: theme-color("primary");
      bottom:0;
      content: '';
      left: 0;
      opacity: .1;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  &.bg-alt .col-3 {
    &:after {
      background-color: theme-color("alt");
    }
  }

  p {
    @include font-size(1.1 * $font-size-base);
  }
}

.lnumber {
  margin-bottom: $spacer * 2;
  padding-left: $spacer * 3;
  position: relative;

  img {
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;

    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
  .number {
    bottom: 0;
    left: -100%;
    padding-right: $spacer;
    padding-top: 14px;
    position: absolute;
    right: calc(100% - #{2 * $spacer});
    text-align: right;
    top: -13px;
  }
}

label {
  margin-bottom: 0;
  margin-left: $spacer;
}

.upload-video {
  @include background-icon-left('~assets/images/upload-video.png');
}

.privacy {
  display: block;
  line-height: 1.2;
}

</style>

<template lang="pug">
  main.index-page.text-center
    include ../templates/index.html
</template>

<script>
import ActionNetworkForm from '~/components/ActionNetworkForm'
import LogoCloud from '~/components/LogoCloud'
import SelfieForm from '~/components/SelfieForm'
import VideoGrid from '~/components/VideoGrid'

export default {
  components: {
    ActionNetworkForm,
    LogoCloud,
    SelfieForm,
    VideoGrid
  }
}
</script>
