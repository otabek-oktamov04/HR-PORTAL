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
            <p>Employee ID: {{ employer.id }}</p>
            <p>Name: {{ employer.employee_name }}</p>
            <p>Email: {{ employer.employee_email }}</p>
          </div>
          <form @submit.prevent="submitForm">
            <div class="card p-4 modal-body py-4 px-6">
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="crucial-conversation" class="form-label"
                    >Crucial Conversation</label
                  >
                  <select
                    id="cbc-terminated"
                    class="form-select"
                    v-model="form.crucial_conversation"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div class="mb-3 w-50">
                  <label for="discipline-letter" class="form-label"
                    >Discipline Letter</label
                  >
                  <select
                    id="consider-rehire"
                    class="form-select"
                    v-model="form.discipline_letter"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="concern-memo" class="form-label"
                    >MEMO OF CONCERN</label
                  >
                  <select
                    id="consider-rehire"
                    class="form-select"
                    v-model="form.concern_memo"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
                <div class="mb-3 w-50">
                  <label for="consider-rehire" class="form-label"
                    >Consider For Re-hire</label
                  >
                  <select
                    id="consider-rehire"
                    class="form-select"
                    v-model="form.consider_rehire"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="consider-rehire-reason" class="form-label"
                    >Reason for Re-hire or Not</label
                  >
                  <textarea
                    id="consider-rehire-reason"
                    class="form-control"
                    v-model="form.consider_rehire_reason"
                    required
                  ></textarea>
                </div>
                <div class="mb-3 w-50">
                  <label for="termination" class="form-label"
                    >Termination Reason</label
                  >

                  <select
                    class="form-select large"
                    aria-label="Default select example"
                    v-model="form.termination"
                  >
                    <option value="null">Other</option>
                    <option v-for="item in terminationReasons" :value="item.id">
                      {{ item.termination_reason }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="termination-reason-other" class="form-label"
                    >Termination Reason (Other)</label
                  >
                  <input
                    :disabled="form.termination !== 'null'"
                    type="text"
                    id="termination-reason-other"
                    class="form-control"
                    v-model="form.termination_reason_other"
                    required
                  />
                </div>
                <div class="mb-3 w-50">
                  <label for="cbc-terminated" class="form-label"
                    >CBC Terminated</label
                  >
                  <select
                    id="cbc-terminated"
                    class="form-select"
                    v-model="form.cbc_terminated"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="cbc-terminated-date" class="form-label"
                    >CBC Terminated Date</label
                  >

                  <VueDatePicker
                    id="cbc-terminated-date"
                    v-model="form.cbc_terminated_date"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                  />
                </div>
                <div class="mb-3 w-50">
                  <label for="deactivate-account" class="form-label"
                    >Deactivate Account</label
                  >
                  <select
                    id="deactivate-account"
                    class="form-select"
                    v-model="form.deactivate_account"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="deactivate-account-date" class="form-label"
                    >Deactivate Account Date</label
                  >

                  <VueDatePicker
                    id="deactivate-account-date"
                    v-model="form.deactivate_account_date"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                  />
                </div>
                <div class="mb-3 w-50">
                  <label for="term-effective-date" class="form-label"
                    >Termination Effective Date</label
                  >

                  <VueDatePicker
                    id="term-effective-date"
                    v-model="form.term_effective_date"
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
      type: Object,
      required: true,
    },
    fetchEmployees: {
      type: Function,
      required: true,
    },
  },
  components: {
    VueDatePicker,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const loading = ref(false);
    const form = reactive({
      crucial_conversation: "",
      discipline_letter: "",
      concern_memo: "",
      consider_rehire: "",
      consider_rehire_reason: "",
      termination: "",
      termination_reason_other: "reason",
      cbc_terminated: "",
      cbc_terminated_date: "",
      deactivate_account: "",
      deactivate_account_date: "",
      term_effective_date: "",
    });

    const terminationReasons = ref([]);

    const getTerminationList = async () => {
      axios
        .get("organization/termination-reasons")
        .then((res) => (terminationReasons.value = res.data.results));
    };

    getTerminationList();

    const submitForm = async () => {
      loading.value = true;

      try {
        // Make an API call to submit the form data
        await axios.post(
          `organization/employees/${props.employer.id}/terminate/`,
          {
            ...form,
            termination: form.termination === "null" ? null : form.termination,
            termination: form.termination.toString(),
            term_effective_date: new Date(
              form.term_effective_date
            ).toLocaleDateString("en-CA"),
            deactivate_account_date: new Date(
              form.deactivate_account_date
            ).toLocaleDateString("en-CA"),
            cbc_terminated_date: new Date(
              form.cbc_terminated_date
            ).toLocaleDateString("en-CA"),
          }
        );

        props.fetchEmployees(1);
        toast.success("Form submitted successfully!");
        closeModal();
      } catch (error) {
        toast.error(
          "An error occurred while submitting the form. Please try again."
        );
      }

      loading.value = false;
    };

    const closeModal = () => {
      emit("close");
    };

    return {
      form,
      loading,
      submitForm,
      closeModal,
      terminationReasons,
    };
  },
};
</script>

<style scoped>
.modal-header {
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
}
</style>
