<script setup>
const props = defineProps({
  isModalOpen: Boolean,
  titleModal: String,
  nameButton: String,
  type: String,
});

const emit = defineEmits(["closeModal", "confirm"]);

const close = () => {
  emit("closeModal");
};

const confirm = () => {
  emit("confirm");
};
</script>

<template>
  <div>
    <div
      v-if="props.isModalOpen"
      @click="close"
      class="position-fixed top-0 left-0 w-100 h-100 bg-black"
      style="opacity: 0.5; left: 0; z-index: 9924"
    ></div>
    <div
      v-if="props.isModalOpen"
      class="position-fixed"
      style="
        width: 350px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9925;
      "
    >
      <div class="bg-light" style="border-radius: 5px">
        <div class="modal-content">
          <div
            class="border-bottom d-flex justify-content-between align-items-center p-3"
          >
            <h3
              style="font-size: 14px !important"
              class="modal-title text-dark"
            >
              {{ props.titleModal }}
            </h3>
            <div @click="close" type="button" class="btn-close p-4"></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3 d-flex justify-content-center">
              <div v-if="removePosition">
                <label class="text-left w-100 text-dark"
                  >How many positions would you like to remove?</label
                >
                <input
                  @input="handleInputRemove"
                  v-model="deleteState.removePos"
                  max="10"
                  min="10"
                  :max="deleteState.maxRemovePos"
                  type="number"
                  class="form-control mx-2 mx-auto"
                />
                <h2 class="text-danger mt-2" v-if="isCheckMaxPosition">
                  Maximal remove postion: {{ deleteState.maxRemovePos }}
                </h2>
              </div>

              <button
                @click="confirm"
                type="button"
                :class="`btn btn-${props.type} btn-lg mt-3 w-100 mx-auto py-2`"
              >
                {{ props.nameButton }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
