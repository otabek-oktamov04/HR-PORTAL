<script setup>
import { ref, defineProps, watchEffect } from "vue";
import { useSupervisors } from "../api/api";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  departmentId: {
    type: Number,
    required: true,
  },
});

const { data: supervisors } = useSupervisors();
const selected = ref();

// Filter the supervisors based on the departmentId prop
const filteredSupervisors = ref(supervisors.value);

watchEffect(() => {
  if (props.departmentId) {
    filteredSupervisors.value = supervisors.value?.filter(
      (item) => item.department.id === props.departmentId
    );
  } else {
    filteredSupervisors.value = supervisors.value;
  }
});

console.log(props.departmentId);
</script>

<template>
  <select
    required
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
    :disabled="props.disabled"
  >
    <option v-for="item in filteredSupervisors" :value="item.id" :key="item.id">
      {{ item.supervisor }}
      <span style="font-size: 10px"> ({{ item.department.department }})</span>
    </option>
  </select>
</template>
