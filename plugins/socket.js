'use strict'
import Vue from 'vue'

function Socket(ctx) { this.ctx = ctx }

function createInstance(ctx) {
  console.log(ctx);
  // `options` は option1, option2 そして anotherOption を含む
  let client = new Socket(ctx);

  client.options = {
    url: ctx.env.apibaseurl
  }

  client.connect()
  return client;
}

export default (ctx, inject) => {
  let apiclient = createInstance(ctx);
  Vue.prototype.$apiclient = apiclient
  inject('apiclient', apiclient)
}

Socket.prototype.connect = function () {
  this.socket = new WebSocket(this.options.url);
  this.socket.onerror = function (e) {
    console.log('websocket error');
    console.error(e)
  }

  let self = this;

  this.socket.onmessage = function (e) {
    var msg = eval("(" + e.data + ")");
    console.log(msg)
    switch (msg.type) {
      case 'connected':
        self.connectionID = msg.body;
        break;
      case 'room-created':
        self.onCreateRoom(msg.body)
        break;
      case 'enter':
        self.onEnterRoom(msg)
        break;
      case 'leave':
        self.onLeave(msg)
        break;
    }
  }
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

// notification

Socket.prototype.onCreateRoom = function (roomID) {
  console.log("on create room. roomID:" + roomID);
}

Socket.prototype.onEnterRoom = function (message) {
  console.log("on enter room.");
  if (message.connectionID == this.connectionID) {
    console.log('skip self connection')
    return;
  }
  this.ctx.store.commit('room/newConnection', { connectionID: message.connectionID })
}

Socket.prototype.onLeave = function (message) {
  console.log("on leave room.");
  this.ctx.store.commit('room/removeConnection', { connectionID: message.connectionID })
}

Socket.prototype._send = function (message) {
  let data = JSON.stringify(message);
  this.socket.send(data);
}

