<template>
  <div>
    <div class="w-full h-300px overflow-auto">
      <div class="text-left">DataTest</div>
      <div class="text-left">isFetching {{ isToutiaoFetching }} </div>
      <div class="break-all">data: {{ JSON.stringify(toutiaoData) }}</div>
    </div>

    <div class="w-full h-300px overflow-auto">
      <div class="text-left">System</div>
      <div class="text-left">isFetching {{ isMobileFetching }} </div>
      <div class="break-all">data: {{ JSON.stringify(mobileData) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/request'
const { data:toutiaoData, isFetching:isToutiaoFetching } = await useFetch("/toutiao/index", "get", { query: { type: "top", page: 1, page_size: 10, is_filter: 1 } })
const { data: mobileData, isFetching: isMobileFetching } = await useFetch("/mobile/get", "get", { query: { phone: 15784154544 } })
</script>
