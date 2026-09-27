<template>
  <span
    class="inline-flex items-center rounded-[20px] px-2.5 py-1.5 text-xs leading-3 tracking-[0.12px] whitespace-nowrap"
    :class="GAYA[status]"
  >
    {{ STATUS_SEMINAR_LABEL[status] }}
  </span>
</template>

<script setup lang="ts">
import { STATUS_SEMINAR_LABEL, type StatusSeminar } from "~/composables/useMahasiswaSaya";

defineProps<{ status: StatusSeminar }>();

const GAYA: Record<StatusSeminar, string> = {
  menunggu: "bg-warning/15 text-warning",
  terkonfirmasi: "bg-success/18 text-success",
  selesai: "bg-success/18 text-success",
};
</script>
