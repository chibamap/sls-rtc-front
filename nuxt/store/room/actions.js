const videosize = {
  width: 420,
  height: 315
}

export default {
  startLocalMedia(store) {
    return navigator.mediaDevices.getUserMedia(
      { video: videosize, audio: true }
    )
      .then(function (stream) {
        store.commit('setLocalStream', stream)
      })
      .catch(err => console.error(err))
  },
  startLocalVideo(store) {
    return navigator.mediaDevices.getUserMedia(
      { video: videosize, audio: false }
    )
      .then(function (stream) {
        store.commit('setLocalVideoStream', stream)
      })
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
    let peer = new RTCPeerConnection({
      sdpSemantics: 'plan-b',
      iceServers: [{
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
        ]
      }]
    })

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
