<template lang="pug">
  v-layout
    v-flex.text-center
      v-btn(@click="startMeeting") start

      div(ref="remoteVideos")
        // remote-video(v-for="conn in connections" connection=conn)
      div.local
        meeting-video(ref="localVideo" muted autoplay)
      v-btn()
</template>

<script>

import RemoteVideo from '~/components/RemoteVideo.vue'

const testRoomID = '6c2c8b8f-2772-4ab3-9784-38e9168af6d1'

const videosize = {
  width: 240,
  height: 180
}

let localStream = null

export default {
  components: {
    RemoteVideo
  },
  data() {
    return {

    }
  },
  computed: {
    roomID: function () {
      return this.$route.params.id
    },
    connections: function() {
      return this.$store.state.room.connections
    }
  },
  mounted() {
    console.log(this.roomID)
    var self = this
    this.startLocalMedia()
    .then(function() {
      self.$refs.localVideo.srcObject = localStream
      self.$refs.localVideo.play()
    })

  },
  methods: {
    startLocalMedia() {
      const self = this
      return navigator.mediaDevices.getUserMedia(
          {video: videosize, audio: true}
        )
        .then(function(stream) {
          localStream = stream
        })
        .catch(err => console.error(err))
    },
    startMeeting() {
      this.$apiclient.enterRoom(this.roomID)
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
