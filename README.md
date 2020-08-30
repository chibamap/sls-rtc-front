# sls-rtc-front

AWSのAPI GatewayがWebSocketに対応していたので、[前に実験したWebRTC](https://github.com/hogehoge-banana/webrtc-test)のバックエンドをサーバーレス化してみたら、フロントエンドのWebRTCの仕様もガッツリ変わってたので、最近良く使っているNuxtjsに焼き直してみました。

## 構成

webrtcに関連するところでいうと、シグナリングの開始のイベントは/room/のuiで開始しております。

- `pages/room/index.vue`

`start meeting` のボタンのイベントでvuexのactionを呼び出し、シグナリングを開始しております。

- `store/room.js`


シグナリングサーバーのwebsocketの実装はプラグイン化してNuxtのコンテキストに注入しております。

- `plugins/socket.js`


## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


----


## reference

https://www.commandlinefu.com/commands/view/13874/one-liner-to-generate-self-signed-ssl-certificatekey-without-any-annoying-prompts-or-csrs


https://webrtc.github.io/samples/
