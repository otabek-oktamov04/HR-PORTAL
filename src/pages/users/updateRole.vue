<template>
  <div v-if="isOpen" style="font-size: 20px">
    <!-- Modal -->
    <div class="inset-0 flex items-center justify-center z-50">
      <div
        id="modalOverlay"
        class="position-fixed top-0 left-0 w-100 h-100 bg-black"
        style="opacity: 0.5; left: 0; z-index: 9924"
      ></div>
      <div
        id="roleModal"
        class="position-fixed"
        style="
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9925;
          width: 40vw !important;
        "
      >
        <div class="bg-white rounded p-4">
          <div
            style="font-size: 14px"
            class="modal-header bg-gray-200 py-4 px-6 rounded-t-lg"
          >
            <p>User ID: {{ user.id }}</p>
            <p>Name: {{ user.username }}</p>
            <p>Email: {{ user.email }}</p>
          </div>
          <form @submit.prevent="submitForm">
            <div class="card p-4 modal-body py-4 px-6">
              <div class="form-group">
                <label for="role">Role</label>
                <select
                  class="form-select"
                  id="role"
                  v-model="user.role"
                  required
                >
                  <option value="approval">Approval</option>
                  <option value="admin">Admin</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-end mt-4">
              <button @click="closeModal" class="btn btn-secondary">
                Cancel
              </button>
              <button
                style="max-width: 70px !important"
                type="submit"
                class="btn add-button"
                :disabled="loading"
              >
                <span v-if="loading">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
                <span v-else>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const loading = ref(false);

    const closeModal = () => {
      emit("close");
    };

    const submitForm = async () => {
      loading.value = true;

      await axios
        .patch(`/user/${props.user.id}/update/`, {
          account_type: props.user.role,
        })
        .then((res) => {
          toast.success("User role updated successfully");
          closeModal();
        })
        .catch((err) => {
          toast.error("Failed to update user role");
        })
        .finally(() => (loading.value = false));
    };

    return {
      closeModal,
      submitForm,
      loading,
      user: props.user,
    };
  },
};
</script>

<style>
select {
  height: 28px;
}

label {
  font-size: 16px;
  font-weight: 400;
}
</style>
