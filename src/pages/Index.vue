<template>
  <q-page class="flex flex-center">
    <q-btn label="Communicate" @click="test" />
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  methods: {
    test () {
      this.$q.bex.send('test.event', { someData: 'test' })
    }
  }
}
</script>
