export const state = () => ({
  newRoomId: null,
})


export const mutations = {
  setNewRoomID(state, { roomID }) {
    state.newRoomId = roomID
  },
}

export const actions = {
  createRoom(store) {
    this.$socket.createRoom()
  }
}
