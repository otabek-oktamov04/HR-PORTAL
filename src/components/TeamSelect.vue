<script setup>
import { ref, defineProps, watchEffect } from "vue";
import { useTeams } from "../api/api";

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

const { data: teams } = useTeams();
const selected = ref();

// Filter the teams based on the departmentId prop
const filteredTeams = ref([]);

watchEffect(() => {
  filteredTeams.value = teams.value?.filter(
    (item) => item.department.id === props.departmentId
  );
});
</script>

<template>
  <select
    required
    v-model="selected"
    class="form-select large"
    aria-label="Default select example"
    :disabled="props.disabled"
  >
    <option v-for="item in filteredTeams" :value="item.id" :key="item.id">
      {{ item.team }}
    </option>
  </select>
</template>
