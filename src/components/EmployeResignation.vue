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
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="resignation-letter" class="form-label"
                    >Resignation Letter</label
                  >
                  <select
                    id="deactivate-account"
                    class="form-select"
                    v-model="form.resignation_letter"
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
                    >Reason for re-hire or not</label
                  >
                  <textarea
                    id="consider-rehire-reason"
                    class="form-control"
                    required
                    v-model="form.consider_rehire_reason"
                  ></textarea>
                </div>
                <div class="mb-3 w-50">
                  <label for="notice-date" class="form-label"
                    >Gave Notice on</label
                  >

                  <VueDatePicker
                    id="notice-date"
                    v-model="form.notice_date"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                  />
                </div>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="notice-begin-date" class="form-label"
                    >Notice Begin Date</label
                  >

                  <VueDatePicker
                    id="notice-begin-date"
                    v-model="form.notice_begin_date"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                    :disabled="true"
                  />
                </div>
                <div class="mb-3 w-50">
                  <label for="termination-date" class="form-label"
                    >Termination Date</label
                  >

                  {{
                    console.log(form.notice_begin_date, form.termination_date)
                  }}
                  <VueDatePicker
                    id="termination-date"
                    v-model="form.termination_date"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    :disabled="!form.notice_begin_date"
                    required
                    :min-date="form.notice_begin_date"
                  />
                </div>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="days-notice-num" class="form-label"
                    >Days Notice</label
                  >
                  <input
                    type="text"
                    id="days-notice-num"
                    class="form-control"
                    v-model="form.days_notice_num"
                    :disabled="true"
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
import { ref, reactive, watchEffect } from "vue";
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
    const form = ref({
      resignation_letter: "",
      consider_rehire: "",
      consider_rehire_reason: "",
      notice_date: 0,
      notice_begin_date: "",
      termination_date: "",
      days_notice_num: "",
      deactivate_account: "",
      deactivate_account_date: "",
      term_effective_date: "",
    });

    const closeModal = () => {
      emit("close");
    };

    const onKeyDown = (evt) => {
      if (["e", "E", "+", "-"].includes(evt.key)) {
        evt.preventDefault();
      }
    };
    function addOneDay(dateString) {
      var date = new Date(dateString);
      date.setDate(date.getDate() + 1);
      return date.toString();
    }

    function calculateDaysBetween(startDateStr, endDateStr) {
      var startDate = new Date(startDateStr);
      var endDate = new Date(endDateStr);

      // Calculate the time difference in milliseconds
      var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());

      // Calculate the number of days
      var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return daysDiff;
    }

    watchEffect(() => {
      if (form.value.notice_date) {
        form.value.notice_begin_date = addOneDay(form.value.notice_date);
      }
    });

    watchEffect(() => {
      if (form.value.termination_date) {
        form.value.days_notice_num = calculateDaysBetween(
          form.value.notice_begin_date,
          form.value.termination_date
        );
      }
    });
    const submitForm = async () => {
      loading.value = true;
      const formValue = form.value;

      await axios
        .post(`/organization/employees/${props.employer.id}/resignate/`, {
          ...formValue,
          term_effective_date: new Date(
            formValue.term_effective_date
          ).toLocaleDateString("en-CA"),
          deactivate_account_date: new Date(
            formValue.deactivate_account_date
          ).toLocaleDateString("en-CA"),
          termination_date: new Date(
            formValue.termination_date
          ).toLocaleDateString("en-CA"),
          notice_begin_date: new Date(
            formValue.notice_begin_date
          ).toLocaleDateString("en-CA"),
          notice_date: new Date(formValue.notice_date).toLocaleDateString(
            "en-CA"
          ),
        })
        .then((res) => {
          toast.success("Data submitted successfully");
          closeModal();
        })
        .catch((err) => {
          toast.error("Failed to submit data");
        })
        .finally(() => (loading.value = false));
    };

    return {
      closeModal,
      submitForm,
      loading,
      employer: props.employer,
      form,
      onKeyDown,
    };
  },
};
</script>

<style>
select {
  height: 34px;
}
label {
  font-size: 16px;
  font-weight: 400;
}
</style>
