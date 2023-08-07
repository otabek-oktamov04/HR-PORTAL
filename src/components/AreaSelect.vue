<script setup>
import { ref } from "vue";
import { useAreas } from "@/api/api";

const { data: areas } = useAreas();
const selected = ref();
</script>
<template>
  <select
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
  >
    <option v-for="item in areas" :value="item.id">{{ item.area }}</option>
  </select>
</template>
