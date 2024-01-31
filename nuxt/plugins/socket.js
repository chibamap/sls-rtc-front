'use strict'

function Socket(ctx) { this.ctx = ctx }

function createInstance(ctx) {
  const s = new Socket(ctx);
  s.options = {
    url: ctx.env.apibaseurl
  }
  s.connect()
  return s;
}

export default (ctx, inject) => {
  const socket = createInstance(ctx);
  inject('socket', socket)
}

Socket.prototype.connect = function () {
  this.socket = new WebSocket(this.options.url);

  this.socket.onerror = function (e) {
    console.log('websocket error');
    console.error(e)
  }.bind(this)

  this.socket.onmessage = function (e) {
    var msg = eval("(" + e.data + ")");
    switch (msg.type) {
      case 'connected':
        this.onConnected(msg)
        break;
      case 'room-created':
        this.onCreateRoom(msg.body)
        break;
      case 'enter':
        this.onEnterRoom(msg)
        break;
      case 'leave':
        this.onLeave(msg)
        break;
      case 'offer':
        this.ctx.store.dispatch('room/onOffer', msg)
        break;
      case 'answer':
        this.ctx.store.dispatch('room/onAnswer', msg)
        break;
      case 'ice-candidate':
        this.ctx.store.dispatch('room/onRemoteIce', msg)
        break;
    }
  }.bind(this)

  this.socket.onclose = function (e) {
    console.log('closed socket.' + e.reason)
    // todo handle as network error. or retry connect
  }.bind(this)
}

// api

Socket.prototype.createRoom = function () {
  this._send({
    "action": "createroom"
  });
}

Socket.prototype.enterRoom = function (roomID) {
  this._send({
    "action": "enterroom",
    "roomID": roomID
  });
}

Socket.prototype.message = function ({ dest, type, message }) {
  this._send({
    "action": "message",
    dest,
    type,
    message
  });
}

// message handler

Socket.prototype.onConnected = function (msg) {
  this.log("connected. connectionID:" + msg.body);
  this.connectionID = msg.body;
}

Socket.prototype.onCreateRoom = function (roomID) {
  this.log("on create room. roomID:" + roomID);
  this.ctx.store.commit('home/setNewRoomID', { roomID })
}

Socket.prototype.onEnterRoom = function (message) {
  if (message.connectionID == this.connectionID) {
    this.ctx.store.commit('room/enterRoom', { roomID: message.roomID })
    return;
  }
  this.ctx.store.dispatch('room/newConnection', { connectionID: message.connectionID })
}

Socket.prototype.onLeave = function (message) {
  console.log("on leave room.");
  this.ctx.store.commit('room/removeConnection', { connectionID: message.connectionID })
}

Socket.prototype._send = function (message) {
  let data = JSON.stringify(message);
  this.socket.send(data);
}

Socket.prototype.log = function (message) {
  console.log('[Socket] ' + message)
}
