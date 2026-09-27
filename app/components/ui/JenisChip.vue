<template>
  <span
    class="inline-flex items-start rounded-[20px] px-2 py-1.25 text-xs leading-normal tracking-[0.12px]"
    :class="jenis === 'sempro' ? 'bg-sempro-soft/50 text-sempro' : 'bg-semhas-soft text-semhas'"
  >
    {{ jenis === "sempro" ? "Sempro" : "Semhas" }}
  </span>
</template>

<script setup lang="ts">
import type { JenisSeminar } from "~/types/domain";

defineProps<{ jenis: JenisSeminar }>();
</script>
