<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  count: {
    type: Number,
    required: true,
  },
});

let currentPage = ref(1);

const emit = defineEmits("pogination");

const computedTotalItem = computed(() => Math.ceil(props.count / 10));

const onClickHandler = (page) => {
  emit("pogination", page);
};
</script>

<template>
  <div class="pogination" v-if="props.count">
    <vue-awesome-paginate
      :total-items="computedTotalItem"
      :items-per-page="1"
      v-model="currentPage"
      :on-click="onClickHandler"
    />
  </div>
</template>

<style>
.pogination {
  display: flex;
  justify-content: center;
}

.pagination-container {
  margin-top: 5px;
  display: flex;
  column-gap: 10px;
}

.paginate-buttons {
  height: 30px;
  width: 30px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f58025;
  border: 1px solid rgb(217, 217, 217);
  color: white;
}

.paginate-buttons:hover {
  background-color: rgb(252, 143, 60);
}

.active-page {
  background-color: #8a3e04;
  border: 1px solid #8a3e04;
  color: white;
}

.active-page:hover {
  background-color: rgb(252, 143, 60);
}
</style>
