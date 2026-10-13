<template>
  <span
    class="inline-flex items-start rounded-[20px] px-2 py-1.25 text-xs leading-normal tracking-[0.12px]"
    :class="proposal ? 'bg-sempro-soft/50 text-sempro' : 'bg-semhas-soft text-semhas'"
  >
    {{ proposal ? "Sempro" : "Semhas" }}
  </span>
</template>

<script setup lang="ts">
import type { JenisSeminar, JenisSeminarUI } from "~/types/domain";

// Menerima kode tampilan ('sempro' | 'semhas') maupun enum database ('seminar_proposal' | 'seminar_hasil').
const props = defineProps<{ jenis: JenisSeminarUI | JenisSeminar }>();
const proposal = computed(() => props.jenis === "sempro" || props.jenis === "seminar_proposal");
</script>
