<script setup>
import { ref } from "vue";
import { usePayGroups } from "@/api/api";

const { data: payGroups } = usePayGroups();
const selected = ref();
</script>
<template>
  <select
    required
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
  >
    <option v-for="item in payGroups" :value="item.id">
      {{ item.pay_group }}
    </option>
  </select>
</template>
