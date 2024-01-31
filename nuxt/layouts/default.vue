<template lang="pug">
  v-app(dark)
    v-main
      nuxt

    v-navigation-drawer(
      v-model="drawer"
      app
    )
      v-list
        v-list-item(
          v-for="(item, i) in items"
          :key="i"
          :href="item.to"
          target='_blank'
        )
          v-list-item-action
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title(v-text="item.title" )
    v-app-bar-nav-icon(@click.stop="drawer = !drawer" absolute)

</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        { icon: 'mdi-nuxt', title: 'frontend', to: 'https://github.com/hogehoge-banana/sls-rtc-front' },
        { icon: 'mdi-aws', title: 'backend', to: 'https://github.com/hogehoge-banana/sls-rtc-backend' },
        { icon: 'mdi-blogger', title: 'My web site', to: 'https://hogehoge-banana.xyz/' }
      ],
    }
  }
}
</script>
