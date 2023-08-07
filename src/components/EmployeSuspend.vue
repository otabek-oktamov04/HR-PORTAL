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
        id="costModal"
        class="position-fixed"
        style="
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9925;
          width: 60vw !important;
        "
      >
        <div class="bg-white rounded p-4">
          <div
            style="font-size: 14px"
            class="modal-header bg-gray-200 py-4 px-6 rounded-t-lg"
          >
            <p>Employee ID : {{ employer.id }}</p>
            <p>Name : {{ employer.employee_name }}</p>
            <p>Email : {{ employer.employee_email }}</p>
          </div>
          <form @submit.prevent="submitForm">
            <div class="card p-4 modal-body py-4 px-6">
              <div class="d-flex w-100 gap-4">
                <div class="form-group w-50">
                  <label for="suspensionType">Suspension Type</label>
                  <input
                    type="text"
                    class="form-control"
                    id="suspensionType"
                    v-model="suspendValue.suspensionType"
                    required
                  />
                </div>

                <div class="form-group w-50">
                  <label for="deactivateAccount">Deactivate Account</label>
                  <select
                    class="form-select"
                    id="deactivateAccount"
                    v-model="suspendValue.deactivateAccount"
                    required
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>

              <div class="d-flex gap-4 w-100">
                <div class="form-group w-50">
                  <label for="deactivateAccountDate"
                    >Deactivate Account Date</label
                  >

                  <VueDatePicker
                    id="deactivateAccountDate"
                    v-model="suspendValue.deactivateAccountDate"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                  />
                </div>

                <div class="form-group w-50">
                  <label for="termEffectiveDate">Term Effective Date</label>

                  <VueDatePicker
                    id="termEffectiveDate"
                    v-model="suspendValue.termEffectiveDate"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-end mt-4">
              <button @click="closeModal" class="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                class="btn add-button"
                style="max-width: 70px !important"
                :disabled="loading"
              >
                <span v-if="loading">
                  <i class="fa fa-spinner fa-spin"></i> Loading...
                </span>
                <span v-else> Submit </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";
import VueDatePicker from "@vuepic/vue-datepicker";
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    employer: {
      type: Object, // Assuming the employee ID is of type string, adjust accordingly if necessary
      required: true,
    },
  },
  components: {
    VueDatePicker,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const loading = ref(false);
    const suspendValue = ref({
      suspensionType: "",
      deactivateAccount: "No",
      deactivateAccountDate: "",
      termEffectiveDate: "",
    });

    const closeModal = () => {
      emit("close");
    };

    const submitForm = async () => {
      loading.value = true;

      await axios
        .post(`/organization/employees/${props.employer.id}/suspend/`, {
          suspension_type: suspendValue.value.suspensionType,
          deactivate_account: suspendValue.value.deactivateAccount,
          deactivate_account_date: new Date(
            suspendValue.value.deactivateAccountDate
          ).toLocaleDateString("en-CA"),
          term_effective_date: new Date(
            suspendValue.value.termEffectiveDate
          ).toLocaleDateString("en-CA"),
        })
        .then((res) => {
          toast.success("Data submitted successfully");
          closeModal();
        })
        .catch((err) => {
          toast.success("Failed to submit data");
        })
        .finally(() => (loading.value = false));
    };

    return {
      closeModal,
      submitForm,
      loading,
      employer: props.employer,
      suspendValue,
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
