<script setup>
import { reactive, onMounted, ref } from "vue";
import axios from "@/utils/axios";

import ConfirmModal from "../components/ConfirmModal.vue";

const positions = ref();
const departments = ref();
const isApproveModal = ref(false);
const isRejectModal = ref(false);
const isApproveModalPos = ref(false);
const isRejectModalPos = ref(false);
const depId = ref("");
const posId = ref("");

const getPositions = async () => {
  const res = await axios.get("/organization/positions/not-approved/");
  positions.value = res.data.results.flatMap((position) =>
    position.details.map((detail) => ({
      ...detail,
      position_name: position.position_name,
      position_id: position.id,
    }))
  );
};
getPositions();
const getDepartments = async () => {
  const res = await axios.get("/organization/departments/not-approved/");
  departments.value = res.data.results;
};
getDepartments();

const approveDepartment = async (id) => {
  isApproveModal.value = true;
  depId.value = id;
};
const approvePosition = async (id, pos_id) => {
  isApproveModalPos.value = true;
  depId.value = id;
  posId.value = pos_id;
};
const RejectDepartment = async (id) => {
  isRejectModal.value = true;
  depId.value = id;
};
const RejectPosition = async (id) => {
  isRejectModalPos.value = true;
  depId.value = id;
};
const confirmPos = async () => {
  try {
    await axios.patch(
      `organization/positions/${posId.value}/create-hr-approve/`,
      {
        dept_approval_code: "a",
        detail_id: depId.value,
      }
    );
    await axios.post(
      `organization/positions/${posId.value}/create-dept-approve/`,
      {
        dept_approval_code: "a",
        detail_id: depId.value,
      }
    );

    isApproveModalPos.value = false;
    getpositions();
  } catch (err) {
    console.log(err);
  }
};
const RejectPos = async () => {
  alert("Reject");
  isRejectModalPos.value = false;
};
const confirmDep = async () => {
  try {
    await axios.post(
      `organization/departments/${depId.value}/create-approve/`,
      {
        cfo_approval_code: "a",
      }
    );
    isApproveModal.value = false;
    getDepartments();
  } catch (err) {
    console.log(err);
  }
};
const RejectDep = async () => {
  alert("Reject");
  isRejectModal.value = false;
};
</script>

<template>
  <div>
    <ConfirmModal
      :isModalOpen="isApproveModal"
      @closeModal="isApproveModal = false"
      @confirm="confirmDep"
      nameButton="Confirm Approve"
      type="success"
      titleModal="Confirm Approve Department"
    />
    <ConfirmModal
      :isModalOpen="isRejectModal"
      @closeModal="isRejectModal = false"
      @confirm="RejectDep"
      nameButton="Confirm Reject"
      type="danger"
      titleModal="Confirm Reject Department"
    />
    <ConfirmModal
      :isModalOpen="isApproveModalPos"
      @closeModal="isApproveModalPos = false"
      @confirm="confirmPos"
      nameButton="Confirm Approve"
      type="success"
      titleModal="Confirm Approve Department"
    />
    <ConfirmModal
      :isModalOpen="isRejectModalPos"
      @closeModal="isRejectModalPos = false"
      @confirm="RejectPos"
      nameButton="Confirm Reject"
      type="danger"
      titleModal="Confirm Reject Department"
    />
    <h1 class="mb-3 text-center">Approvals</h1>
    <div class="">
      <nav>
        <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
          <button
            class="nav-link active"
            id="nav-home-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-supervisor"
            type="button"
            role="tab"
            aria-controls="nav-supervisor"
            aria-selected="true"
          >
            Positions
          </button>

          <button
            class="nav-link"
            id="nav-profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-pay-settings"
            type="button"
            role="tab"
            aria-controls="nav-pay-settings"
            aria-selected="false"
          >
            Departments
          </button>
        </div>
      </nav>
      <div class="tab-content p-3 border bg-light" id="nav-tabContent">
        <div
          class="tab-pane show"
          id="nav-supervisor"
          role="tabpanel"
          aria-labelledby="nav-home-tab"
        >
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Positions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in positions" :key="item.id">
                <td style="width: 30px">
                  {{ index + 1 }}
                </td>
                <td>{{ item.position_name }}</td>
                <td>
                  <div class="d-flex justify-content-end gap-3">
                    <button
                      @click="approvePosition(item.id, item.position_id)"
                      class="btn btn-success"
                    >
                      Approve
                    </button>
                    <button
                      @click="RejectPosition(item.id, item.position_id)"
                      class="btn btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="tab-pane"
          id="nav-pay-settings"
          role="tabpanel"
          aria-labelledby="nav-profile-tab"
        >
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Departments</th>
                <th>Department Code</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in departments" :key="item.id">
                <td style="width: 30px">
                  {{ index + 1 }}
                </td>
                <td>{{ item.department_name }}</td>
                <td>{{ item.department_code }}</td>
                <td>
                  <div class="d-flex justify-content-end gap-3">
                    <button
                      @click="approveDepartment(item.id)"
                      class="btn btn-success"
                    >
                      Approve
                    </button>
                    <button
                      @click="RejectDepartment(item.id)"
                      class="btn btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
