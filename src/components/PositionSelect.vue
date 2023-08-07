<script setup>
import { onMounted, ref } from "vue";
import axios from "@/utils/axios";

const selected = ref();
const options = ref();

const emit = defineEmits(["handleEmit"]);

const getDepartment = async () => {
  let res = await axios.get("/organization/positions/");
  options.value = res.data.results;
};
const handleChange = () => {
  emit("handleEmit");
};

onMounted(() => {
  getDepartment();
});
</script>
<template>
  <select
    v-model="selected"
    @change="handleChange"
    class="form-select large"
    aria-label="Default select example"
  >
    <option v-for="item in options" :value="item.id">
      {{ item.position }}
    </option>
  </select>
</template>

<style scoped></style>
