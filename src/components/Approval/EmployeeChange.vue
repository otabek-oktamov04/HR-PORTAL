<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";

const isModal = ref(false);
const employers = ref([]);
const currentEmployer = ref(null);
const denyReason = ref("");
const isSubmittingDeny = ref(false);
const isSubmittingApprove = ref(false);

const fetchEmployers = async () => {
  try {
    const response = await axios.get(
      "/organization/employees/changes/not-approved/"
    );

    employers.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
};

const openViewModal = (employer) => {
  currentEmployer.value = employer;
  isModal.value = true;
};

const closeViewModal = () => {
  currentEmployer.value = null;
  isModal.value = false;
  denyReason.value = "";
};

const approveEmployer = async () => {
  if (currentEmployer.value) {
    isSubmittingApprove.value = true;

    try {
      await axios.post(
        `/organization/employees/changes/${currentEmployer.value.id}/approve/`
      );
      fetchEmployers();
      closeViewModal();
      toast.success("Employer Approved");
    } catch (error) {
      console.error(error);
    } finally {
      isSubmittingApprove.value = false;
    }
  }
};

const denyEmployer = async () => {
  if (currentEmployer.value) {
    isSubmittingDeny.value = true;

    try {
      await axios.post(
        `/organization/employees/changes/${currentEmployer.value.id}/approve/`,
        {
          deny_reason: denyReason,
        }
      );
      fetchEmployers();
      closeViewModal();
      toast.success("Employer Denied");
    } catch (error) {
      console.error(error);
    } finally {
      isSubmittingDeny.value = false;
    }
  }
};

fetchEmployers();
</script>

<template>
  <div>
    <div
      v-if="currentEmployer"
      @click="closeViewModal"
      class="position-fixed top-0 left-0 w-100 h-100 bg-black"
      style="opacity: 0.5; left: 0; z-index: 9924"
    ></div>
    <div
      v-if="isModal"
      class="position-fixed w-50"
      style="
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
            <h3 class="modal-title text-dark">Employer Details</h3>
            <div @click="closeViewModal" type="button" class="btn-close"></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <form class="">
                <div class="row justify-content-start">
                  <div class="form-group col-4">
                    <label for="text" class="">EMPLOYER NAME</label>
                    <input
                      disabled
                      type="text"
                      class="form-control"
                      id="text"
                      v-model="currentEmployer.employer_name"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">EMPLOYER CODE</label>
                    <input
                      v-model="currentEmployer.employer_code"
                      disabled
                      type="text"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class="">EFFECTIVE DATE</label>
                    <input
                      disabled
                      v-model="currentEmployer.effective_date"
                      type="text"
                      class="form-control"
                      id="text"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="denyReason" class="">Deny Reason</label>
                  <textarea
                    v-model="denyReason"
                    id="denyReason"
                    class="form-control"
                    rows="3"
                  ></textarea>
                </div>
              </form>
              <div class="d-flex justify-content-center mt-5">
                <button
                  @click="approveEmployer()"
                  :disabled="isSubmittingApprove"
                  class="btn btn-success btn-lg mt-3 py-2"
                >
                  <span
                    v-if="isSubmittingApprove"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Approve
                </button>
                <button
                  @click="denyEmployer()"
                  :disabled="!denyReason || isSubmittingDeny"
                  class="btn btn-danger btn-lg mt-3 mx-2 py-2"
                >
                  <span
                    v-if="isSubmittingDeny"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Deny
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <table class="mb-5 table table-striped mt-5">
      <thead>
        <tr>
          <th>#</th>

          <th>DATE ENTERED</th>
          <th>SUBMITTED BY</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in employers" :key="index">
          <td style="width: 30px">{{ index + 1 }}</td>

          <td>{{ item.date_entered }}</td>
          <td>{{ item.submitter.first_name }}</td>
          <td>
            <div class="d-flex gap-3">
              <button @click="openViewModal(item)" class="btn btn-secondary">
                view
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
