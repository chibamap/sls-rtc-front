<template lang="pug">
  div.root
    v-container.main.d-flex.align-content-center.flex-wrap
      v-card(outlined v-for="(connection, index) in connections" :key="index").align-self-center
        remote-video(:connection="connection").mate
        v-card-subtitle remote cam
      v-card(outlined).align-self-center
        video(ref="localVideo" muted autoplay).mate
        v-card-subtitle local cam
    MeetingToolbar(
      :start="startMeeting"
      :toggleCam="toggleCam"
      :toggleMic="toggleMic"
    )

</template>

<script>

import RemoteVideo from '~/components/RemoteVideo.vue'
import MeetingToolbar from '~/components/MeetingToolbar.vue'

const videosize = {
  width: 240,
  height: 180
}

export default {
  components: {
    RemoteVideo,
    MeetingToolbar
  },
  data() {
    return {
    }
  },
  computed: {
    roomID: function () {
      return this.$store.state.room.id
    },
    connections: function() {
      return this.$store.state.room.connections
    },
    localVideoStream: function () {
      return this.$store.state.room.localVideoStream
    },
    localStream: function () {
      return this.$store.state.room.localStream
    }
  },
  mounted() {
    const self = this
  },
  methods: {
    startLocalMedia() {
      const self = this
      return navigator.mediaDevices.getUserMedia(
          {video: videosize, audio: true}
        )
        .catch(err => console.error(err))
    },
    startMeeting() {
      console.log('start meeting')
      return
      this.$store.dispatch('room/enter', { roomID: this.$route.query.id })
    },
    toggleCam() {
      console.log('toggle cam')
      const self = this
      if (!this.localVideoStream) {
        this.$store.dispatch('room/startLocalVideo')
          .then(function() {
            self.$refs.localVideo.srcObject = self.localVideoStream
          })
          .catch(err => console.error(err))
      }

    },
    toggleMic() {
      console.log('toggle mic')
    },
  }
}
</script>

<style>
.root, main, .main {
  height: 100%;
}
video {
  width: 240px;
  height: 180px;
  border: 1px solid black;
}
</style>
