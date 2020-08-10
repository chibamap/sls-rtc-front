<template lang="pug">
  v-app(dark)
    v-navigation-drawer(
      v-model="drawer"
      app
    )
      v-list
        v-list-item(href="https://hogehoge-banana.xyz" target='_blank')
          v-list-item-content
            v-list-item-title(v-text="'my blog'")


        v-list-item(
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        )
          v-list-item-action
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title(v-text="item.title" )
    v-app-bar-nav-icon(@click.stop="drawer = !drawer" )
    v-main
      v-container
        nuxt

</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'Inspire',
        //   to: '/inspire'
        // }
      ],
    }
  }
}
</script>
