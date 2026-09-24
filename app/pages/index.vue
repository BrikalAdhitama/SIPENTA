<script setup lang="ts">
const { profile, role } = useAuth();

if (!profile.value) await navigateTo("/login");
else if (role.value === "mahasiswa") await navigateTo("/mahasiswa");
else if (role.value === "dosen") await navigateTo("/dosen");
else await navigateTo("/admin");
</script>

<template>
  <div />
</template>
