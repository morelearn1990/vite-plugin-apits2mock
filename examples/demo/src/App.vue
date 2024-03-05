<script setup lang="ts">
import DataTest from './components/DataTest.vue'
</script>

<template>
  <Suspense>
    <DataTest />

  </Suspense>
</template>

<style >
body,html,#app{
  width: 100%;
  height:100%;
  overflow: hidden;
  position: relative;
}
</style>
