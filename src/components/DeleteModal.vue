<script setup>
import { ref } from "vue";
const props = defineProps({
  effectiveDate: Boolean,
  PositionNumber: Number,
  modalId: String,
  title: {
    type: String,
    default: false,
  },
});
const date = ref("");
const removePositionNumber = ref("");
const emit = defineEmits(["date", "number_position", "deleteEvent"]);

const handleInputDate = () => {
  emit("date");
};
const handleInputNumber = () => {
  emit("number_position", removePositionNumber.value);
};

const handleDelete = () => {
  emit("deleteEvent");
  const closeBtn = document.querySelector(".btn-close");
  closeBtn.click();
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div class="modal" :id="`v${props.modalId}`">
      <div class="modal-dialog modal-dialog-centered modal-w">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title text-dark">
              {{ props.title }}
            </h3>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="w-100 mt-3 mb-3 r p-3">
            <div v-if="props.PositionNumber">
              <label for="test1" class="text-left w-100 text-dark"
                >Remove Position Number</label
              >
              <input
                @input="handleInputNumber"
                v-model="removePositionNumber"
                type="text"
                class="form-control mx-2 mx-auto"
              />
            </div>
            <div v-if="props.effectiveDate">
              <label for="" class="text-left w-100 text-dark"
                >Effective date</label
              >

              <VueDatePicker
                id="effectiveDate"
                format="yyyy-MM-dd"
                :min-date="new Date()"
                required
                v-model="date"
                @input="handleInputDate"
                auto-apply
                :enable-time-picker="false"
                placeholder="mm/dd/yyyy"
                class="date"
              />
            </div>
            <button
              @click="handleDelete"
              type="button"
              class="btn btn-danger btn-lg mt-3 w-100 mx-auto py-2"
            >
              Confirm delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-w {
  --bs-modal-width: 400px;
}
</style>
