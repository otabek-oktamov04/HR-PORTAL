<script setup>
import { ref } from "vue";
import { useJobDescriptions } from "@/api/api";

const { data: jobDescriptions } = useJobDescriptions();
const selected = ref();
</script>
<template>
  <select
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
  >
    <option value="null">Other</option>
    <option v-for="item in jobDescriptions" :value="item.id">
      {{ item.job_description }}
    </option>
  </select>
</template>
