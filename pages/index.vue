<template lang="pug">
  v-layout(column justify-center align-center)
    v-flex(xs12 sm8 md6)
      v-card
        v-card-title.headline Welcome to serverless webrtc testing
        v-card-text
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="createRoom") Create New Room

</template>

<script>

const testRoomID = '6c2c8b8f-2772-4ab3-9784-38e9168af6d1'

export default {
  methods: {
    createRoom() {
      console.log('create room')

      this.$router.push({name: 'room-id', params: {id:  testRoomID }} )
    },

  }
}

</script>
