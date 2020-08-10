
console.log('room store loaded')

export const state = () => ({
  localStream: null,
  connections: []
})

export const mutations = {
  startLocalMedia(state, { videosize }) {
    const self = this
    return navigator.mediaDevices.getUserMedia(
      { video: videosize, audio: true }
    )
      .then(function (stream) {
        state.localStream = stream
      })
      .catch(err => console.error(err))
  },
  newConnection(state, conn) {
    state.connections.push(conn)
    sendOffer(conn)
  },
  removeConnection(state, { connectionID }) {
    let target = state.connections.find(conn => conn.connectionID == connectionID)
    state.connections.splice(state.connections.indexOf(target), 1)
  }
}

const rtcOfferOptions = null;

function sendOffer(state, conn) {
  let peerConnection = preparePeerConnection(state, conn)
  peerConnection.createOffer()
    .then()

}

function preparePeerConnection(state, connection) {
  try {
    let peer = new RTCPeerConnection()

    // send any ice candidates to the other peer
    peer.onicecandidate = function (event) {
      if (evt.candidate) {
        console.log('on candidate');
        let message = {
          type: 'candidate',
          message: event.candidate
        }
        // TODO send offer
      } else {
        console.log("candidate end. ------- phase=" + event.eventPhase);
      }
    }
    peer.ontrack = function (e) {
      console.log('ontrack')
      connection.stream = e.streams[0]
      console.log(connection)
    }
    connection.peer = peer
    return peer


  } catch (e) {
    console.log('failed to create peer connection')
    console.error(e)
  }
}
