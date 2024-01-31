export default {
  setLocalStream(state, stream) {
    state.localStream = stream
  },
  setLocalVideoStream(state, stream) {
    state.localVideoStream = stream
  },
  setLocalAudioStream(state, stream) {
    state.localAudioStream = stream
  },
  enterRoom(state, { roomID }) {
    state.id = roomID
  },
  addConnection(state, connection) {
    state.connections.push(connection)
  },
  removeConnection(state, { connectionID }) {
    const target = this.getters['room/connection'](connectionID)
    state.connections.splice(state.connections.indexOf(target), 1)
  },
  setLocalSDP(state, { connectionID, sdp }) {
    const target = this.getters['room/connection'](connectionID)
    target.peer.setLocalDescription(sdp)
  },
  setRemoteSDP(state, { connectionID, sdp }) {
    const target = this.getters['room/connection'](connectionID)
    target.peer.setRemoteDescription(sdp)
  },
  setRemoteStream(state, { connectionID, stream }) {
    const target = this.getters['room/connection'](connectionID)
    if (null === target) {
      console.log(`target connection not found ${connectionID}.`)
      return
    }
    if (stream.getAudioTracks().length) {
      target.audioStream = stream
    }
    if (stream.getVideoTracks().length) {
      target.videoStream = stream
    }
  },
  connectionReady(state, { connectionID }) {
    const target = this.getters['room/connection'](connectionID)
    if (null === target) {
      console.error(`target connection not found ${connectionID}.`)
      return
    }
    target.ready = true
    const index = state.connections.indexOf(target)
    state.connections.splice(index, 1, target)
  }
}
