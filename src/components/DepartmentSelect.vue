<script setup>
import { onMounted, ref } from "vue";
import { useDepartments } from "../api/api";

const { data: departments } = useDepartments();

const selected = ref("");
</script>

<template>
  <select
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
    required
  >
    <option v-for="item in departments" :value="item.id">
      {{ item.department }} - {{ item.department_code }}
    </option>
  </select>
</template>
