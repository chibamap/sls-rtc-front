<template lang="pug">
  div
    video(ref="video" autoplay)
    audio(ref='audio' autoplay)
</template>

<script>

export default {
  props: {
    connection: Object,
  },
  data() {
    return {
    }
  },
  computed: {
    videoStream: function () {
      return this.connection.videoStream
    },
    audioStream: function () {
      return this.connection.audioStream
    }
  },
  watch: {
    connection: {
      handler: function(conn, old) {
        this.connectionChanged(conn, old)
      },
      deep: true
    },
  },
  mounted() {
    this.$refs.video.srcObject = this.videoStream
    this.$refs.audio.srcObject = this.audioStream
  },
  methods: {
    connectionChanged(conn, old) {
      if (this.audioStream && this.$refs.audio.srcObject != this.audioStream) {
        this.observeStream(this.audioStream)
        this.$refs.audio.srcObject = this.audioStream
      }

      if (this.videoStream && this.$refs.video.srcObject != this.videoStream) {
        this.observeStream(this.videoStream)
        this.$refs.video.srcObject = this.videoStream
      }
    },
    observeStream(stream) {
      stream.addEventListener('addtrack', (event) => {
          console.log(`New ${event.track.kind} track added`);
        })
      stream.addEventListener('removetrack', (event) => {
          console.log(` ${event.track.kind} track Removed`);
        })
    }
  }
}
</script>

<style>
video {
  width: 240px;
  height: 180px;
  border: 1px solid black;
}
</style>
