
<template>

<div class="container"> <div class="card"> <h2>我的礼包</h2> <div v-for="g in gifts" :key="g.id" class="gift"> <strong>{{ g.title }}</strong> <p class="tip">奖励：{{ g.reward }}</p> <p class="tip">领取时间：{{ format(g.claimed_at) }}</p> </div> <p v-if="!gifts.length" class="tip">还没有领取过礼包</p> </div> </div> </template><script setup> import { ref, onMounted } from 'vue'; import { contentApi } from '../api'; const gifts = ref([]); function format(ts) { return new Date(ts).toLocaleString(); } onMounted(async () => { const res = await contentApi.myGifts(); gifts.value = res.data; }); </script><style scoped> .gift { padding: 12px 0; border-bottom: 1px solid #f0f0f0; } .gift:last-child { border-bottom: none; } </style>
