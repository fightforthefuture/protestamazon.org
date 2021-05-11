<i18n src="~/locales/components/PageFooter.yml"></i18n>
<i18n src="~/locales/global.yml"></i18n>

<style lang="scss" scoped>
footer {
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);

  img {
    margin: $spacer;
    max-height: 100px;
    max-width: 200px;
  }
}
.arrow-up {
  @include arrow-up($body-bg);
}
</style>

<template>
  <footer class="text-center">
    <div class="bg-gray-light p-4">
      {{ $t('built_by') }}<br>
      <div class="d-flex align-items-center flex-wrap">
        <div class="col-md-4">
          <a href="https://www.mediajustice.org" target="_blank">
            <img src="/logos/MediaJustice.png" alt="MediaJustice">
          </a>
        </div>
        <div class="col-md-4">
          <a href="https://www.fightforthefuture.org" target="_blank">
            <img src="/logos/Fight for the Future.svg" alt="Fight for the Future" style="width:200px">
          </a>
        </div>
        <div class="col-md-4">
          <a href="https://athenaforall.org" target="_blank">
            <img src="/logos/Athena Coalition.png" alt="Athena Coalition">
          </a>
        </div>
      </div>
    </div>
    <div class="arrow-up p-4">
      <p>
        {{ $t('for_press') }}<br>
        <small v-html="$t('press_contact_html')"></small>
      </p>
      <p>
        <small v-html="$t('other_contact_html')"></small>
      </p>
    </div>
  </footer>
</template>
