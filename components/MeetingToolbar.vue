<template lang="pug">
  v-footer(absolute).d-flex
    v-btn(icon @click="toggleCam")
      v-icon(v-if="!videoActive") mdi-video
      v-icon(v-else color="red") mdi-video-off
    v-btn(icon @click="toggleMic")
      v-icon(v-if="!micActive") mdi-microphone
      v-icon(v-else color="red") mdi-microphone-off
    v-spacer
    v-btn(v-if="!meetingActive"
      @click="meetingActive=!meetingActive" color='primary') join meeting
    v-btn(v-else
      @click="meetingActive=!meetingActive" color='red') leave


</template>
<script>
export default {
  data() {
    return {
      videoActive: false,
      micActive: false,
      meetingActive: false,
    }
  },
  props: {
    startMeeting: Function,
    toggleCam: Function,
    toggleMic: Function
  },
  methods: {
  }
}
</script>
<style>

</style>
