export default {
  connection: (state) => (id) => {
    return state.connections.find(conn => conn.id == id)
  },
  localVideoTrack: (state) => {
    if (!state.localVideoStream) {
      return null
    }
    return state.localStream.getVideoTracks()
      ? state.localVideoStream.getVideoTracks()[0]
      : null
  },
  localAudioTrack: (state) => {
    if (!state.localAudioStream) {
      return null
    }
    return state.localAudioStream.getAudioTracks()
      ? state.localAudioStream.getAudioTracks()[0]
      : null
  }
}
