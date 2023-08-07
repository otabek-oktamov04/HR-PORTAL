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
        id="departmentModal"
        class="position-fixed"
        style="
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9925;
          width: 90vw !important;
        "
      >
        <div class="bg-white rounded">
          <div class="d-flex justify-content-end" style="margin-bottom: 10px">
            <div @click="closeModal" type="button" class="btn-close p-4"></div>
          </div>
          <div class="card p-4 modal-body py-4 px-6">
            <div
              class="d-flex w-100 flex-column"
              style="max-height: 400px; overflow-y: scroll"
            >
              <table class="table table-striped">
                <thead style="font-size: 14px">
                  <tr>
                    <th>ORDER</th>
                    <th>EMPLOYEE ID</th>
                    <th>NAME</th>
                    <th>POSITION</th>
                    <th>DEPARTMENT</th>
                    <th>TEAM</th>
                    <th>REGION</th>
                    <th>LOCATION</th>
                    <th>SUPERVISOR</th>
                    <th>HIRE DATE</th>
                  </tr>
                </thead>
                <tbody style="font-size: 16px">
                  <tr
                    v-if="departmentEmployees.length && !isDepartmentLoading"
                    v-for="(employer, index) in departmentEmployees"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ employer.id }}</td>
                    <td>{{ employer.employee_name }}</td>
                    <td>{{ employer.position.position }}</td>
                    <td>{{ employer.department.department }}</td>
                    <td>{{ employer.team.team }}</td>
                    <td>{{ employer.region?.region }}</td>
                    <td>{{ employer.location.work_location }}</td>
                    <td>{{ employer.supervisor.supervisor }}</td>

                    <td>{{ employer.date_of_hire }}</td>
                  </tr>
                  <tr
                    v-if="
                      departmentEmployees.length === 0 && !isDepartmentLoading
                    "
                  >
                    <td colspan="3" style="text-align: center">
                      No employers found.
                    </td>
                  </tr>
                  <tr v-if="isDepartmentLoading">
                    <td colspan="3" style="text-align: center">Loading...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps, defineEmits } from "vue";
import { toast } from "vue3-toastify";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    isDepartmentLoading: {
      type: Boolean,
      required: true,
    },
    departmentEmployees: {
      type: Array,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const closeModal = () => {
      emit("close");
    };

    return {
      closeModal,
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
