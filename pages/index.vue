<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6)
      v-card
        v-card-title.headline Welcome to webrtc testing
        v-card-text room id: {{ roomID }}
        v-card-actions
          v-spacer
          v-btn(v-if="roomID" @click="goRoom" color="secondary") go to room
          v-btn(v-else @click="createRoom" color="primary" ) Create New Room

</template>

<script>

export default {
  computed: {
    roomID: function () {
      return this.$store.state.home.newRoomId
    }
  },
  methods: {
    createRoom() {
      this.$store.dispatch('home/createRoom')
    },
    goRoom() {
      this.$router.push({name: 'room-id', params: {id:  this.roomID }} )
    },

  }
}

</script>
