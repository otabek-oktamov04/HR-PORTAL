<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";

const isModal = ref(false);
const departments = ref([]);
const currentDepartment = ref(null);
const denyReason = ref("");
const isSubmittingDeny = ref(false);
const isSubmittingApprove = ref(false);

const fetchDepartments = async () => {
  try {
    const response = await axios.get("/organization/departments/not-approved/");

    departments.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
};

const openViewModal = (department) => {
  (currentDepartment.value = department), (isModal.value = true);
};

const closeViewModal = () => {
  (currentDepartment.value = null), (isModal.value = false);
  denyReason.value = "";
};

const addFTEPosition = async () => {
  if (currentDepartment) {
    isSubmittingApprove.value = true;

    await axios.post(
      `/organization/departments/${currentDepartment.value.id}/create-approve/`,
      {
        approval_code: "a",
      }
    );
    fetchDepartments();
    closeViewModal();
    toast.success("Department Approved");
    isSubmittingApprove.value = false;
  }
};

const denyFTEPosition = async () => {
  if (currentDepartment) {
    isSubmittingDeny.value = true;
    await axios
      .post(
        `/organization/departments/${currentDepartment.value.id}/create-approve/`,
        {
          approval_code: "d",
          deny_reason: denyReason,
        }
      )
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        isSubmittingDeny.value = false;
        fetchDepartments();
        closeViewModal();
        toast.success("Department Denied");
      });
  }
};

fetchDepartments();
</script>

<template>
  <div>
    <div
      v-if="currentDepartment"
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
            <h3 class="modal-title text-dark">Add Department</h3>
            <div @click="closeViewModal" type="button" class="btn-close"></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <form class="">
                <div class="row justify-content-start">
                  <div class="form-group col-4">
                    <label for="text" class="">DEPARTMENT NAME</label>
                    <input
                      disabled
                      type="text"
                      class="form-control"
                      id="text"
                      v-model="currentDepartment.department_name"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">DEPARTMENT CODE</label>
                    <input
                      v-model="currentDepartment.department_code"
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
                      v-model="currentDepartment.effective_date"
                      type="text"
                      class="form-control"
                      id="text"
                    />
                  </div>
                </div>
                <div class="row justify-content-start">
                  <div class="form-group col-4">
                    <label for="text" class="">CONTRACT START DATE</label>
                    <input
                      disabled
                      type="text"
                      class="form-control"
                      id="text"
                      v-model="currentDepartment.contract_start_date"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">CONTRACT END DATE</label>
                    <input
                      v-model="currentDepartment.contract_end_date"
                      disabled
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
                  @click="addFTEPosition()"
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
                  @click="denyFTEPosition()"
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
        <tr v-for="(item, index) in departments" :key="index">
          <td style="width: 30px">{{ index + 1 }}</td>

          <td>{{ item.created_date }}</td>
          <td>{{ item.submitter.first_name }}</td>

          <td>
            <div class="d-flex gap-3">
              <button @click="openViewModal(item)" class="btn view-button">
                view
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
