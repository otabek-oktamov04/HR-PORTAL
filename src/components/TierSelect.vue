<script setup>
import { ref } from "vue";
import { useTiers } from "@/api/api";

const { data: tiers } = useTiers();
const selected = ref();
</script>
<template>
  <select
    required
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
  >
    <option v-for="item in tiers" :value="item.id">{{ item.tier }}</option>
  </select>
</template>
