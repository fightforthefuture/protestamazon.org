<template lang="pug">
  main.index-page.text-center
    include ../templates/index.html
</template>

<script>
import ActionNetworkForm from '~/components/ActionNetworkForm'
import LogoCloud from '~/components/LogoCloud'
import SelfieForm from '~/components/SelfieForm'

export default {
  components: {
    ActionNetworkForm,
    LogoCloud,
    SelfieForm
  }
}
</script>
