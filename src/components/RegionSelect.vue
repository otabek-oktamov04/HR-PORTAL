<script setup>
import { ref } from "vue";
import { useRegions } from "@/api/api";

const { data: regions } = useRegions();
const selected = ref();
</script>
<template>
  <select
    required
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
  >
    <option v-for="item in regions" :value="item.id">{{ item.region }}</option>
  </select>
</template>
