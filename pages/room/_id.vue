<template lang="pug">
  div.root
    v-container.main.d-flex.align-content-center.flex-wrap
      v-card(outlined v-for="(connection, index) in connections" :key="index").align-self-center
        remote-video(:connection="connection").mate
        v-card-subtitle remote cam
      v-card(outlined).align-self-center
        video(ref="localVideo" muted autoplay).mate
        v-card-subtitle local cam

    v-footer(absolute)
      v-spacer
      v-btn(@click="startMeeting" v-if="!roomID" color='primary') star meeting

</template>

<script>

import RemoteVideo from '~/components/RemoteVideo.vue'

const testRoomID = '6c2c8b8f-2772-4ab3-9784-38e9168af6d1'

const videosize = {
  width: 240,
  height: 180
}

export default {
  layout: 'room',
  components: {
    RemoteVideo
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
    localVideoTrack: function () {
      return this.$store.getters['room/localVideoTrack']
    },
    localStream: function () {
      return this.$store.state.room.localStream
    }
  },
  mounted() {
    const self = this
    this.$store.dispatch('room/startLocalMedia')
      .then(function() {
        self.$refs.localVideo.srcObject = self.localStream
      })
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
      this.$store.dispatch('room/enter', { roomID: this.$route.params.id })
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
