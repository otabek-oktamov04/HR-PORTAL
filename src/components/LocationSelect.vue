<script setup>
import { ref } from "vue";
import { useLocations } from "@/api/api";

const { data: locations } = useLocations();
const selected = ref();
</script>
<template>
  <select
    required
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
  >
    <option v-for="item in locations" :value="item.id">
      {{ item.work_location }} - {{ item?.details?.city }} -
      {{ item?.details?.state }}
    </option>
  </select>
</template>
