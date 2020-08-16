
export const state = () => ({
  id: null,
  localStream: null,
  connections: []
})

export const getters = {
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

export const mutations = {
  setLocalStream(state, stream) {
    state.localStream = stream
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

const videosize = {
  width: 240,
  height: 180
}

// actions

export const actions = {
  startLocalMedia(store) {
    return navigator.mediaDevices.getUserMedia(
      { video: videosize, audio: true }
    )
      .then(function (stream) {
        store.commit('setLocalStream', stream)
      })
      .catch(err => console.error(err))
  },
  enter(store, { roomID }) {
    this.$socket.enterRoom(roomID)
  },
  async newConnection(store, { connectionID }) {
    const peer = newPeer(store, connectionID)
    const connection = createConnection(connectionID, peer)
    store.commit('addConnection', connection)

    const sdp = await createOffer(peer)
    peer.setLocalDescription(sdp)

    const sdpText = JSON.stringify(sdp)
    this.$socket.message({
      dest: connectionID,
      type: sdp.type,
      message: sdpText
    })
  },

  async onOffer(store, msg) {
    const peer = newPeer(store, msg.from)
    const connection = createConnection(msg.from, peer)
    store.commit('addConnection', connection)

    const sdp = JSON.parse(msg.body)
    peer.setRemoteDescription(sdp)

    const answer = await peer.createAnswer()
    peer.setLocalDescription(answer)

    const answerText = JSON.stringify(answer)
    this.$socket.message({
      dest: msg.from,
      type: answer.type,
      message: answerText
    })
  },
  onAnswer(store, msg) {
    const target = store.getters.connection(msg.from)
    const sdp = JSON.parse(msg.body)
    target.peer.setRemoteDescription(sdp)
  },
  onLocalIce(store, { connectionID, candidate }) {
    const candidateText = JSON.stringify(candidate)
    this.$socket.message({
      dest: connectionID,
      type: 'ice-candidate',
      message: candidateText
    })
  },
  onRemoteIce(store, msg) {
    try {
      const candidate = JSON.parse(msg.body)
      const target = store.getters.connection(msg.from)
      if (!target) {
        console.log('target connetion not found')
        return
      }
      target.peer.addIceCandidate(candidate)
    } catch (e) {
      console.error(e)
    }
  },
  onConnectionReady(store, { connectionID }) {
    console.log('onConnectionReady  -->' + connectionID)
  },
  onRemoteTrack(store, { connectionID, event }) {
    event.streams.forEach(function (stream) {
      store.commit('setRemoteStream', { connectionID, stream })
    })
  }
}

function createConnection(id, peer) {
  return {
    id,
    peer,
    stream: null,
    videoStream: null,
    audioStream: null,
  }
}

function newPeer(store, connectionID) {
  try {
    let peer = new RTCPeerConnection({ sdpSemantics: 'plan-b' })

    peer.onicecandidate = function (event) {
      if (event.candidate) {
        store.dispatch('onLocalIce', { connectionID, candidate: event.candidate })
      }
    }

    peer.ontrack = function (event) {
      console.log('---- on remote track')
      store.dispatch('onRemoteTrack', { connectionID, event })
    }

    peer.onconnectionstatechange = function (e) {
      console.log('onconnectionstatechange -->' + peer.connectionState)
      if ('connected' === peer.connectionState) {
        store.dispatch('onConnectionReady', { connectionID })
      }
    }

    peer.onsignalingstatechange = function (e) {
      console.log('onsignalingstatechange -->' + peer.signalingState)
    }

    store.state.localStream.getTracks().forEach(function (track) {
      peer.addTrack(track)
    })

    return peer

  } catch (e) {
    console.log('failed to create peer connection')
    console.error(e)
  }
}

async function createOffer(peer) {
  try {
    const sdp = await peer.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    })
    return sdp
  } catch (e) {
    console.error(e)
  }
}
