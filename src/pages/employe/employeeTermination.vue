<template>
  <div>
    <div class="">
      <h1
        class="text-center"
        style="
          color: #f58025;
          font-weight: 600;
          font-family: 'Roboto';
          font-size: 18px;
          text-transform: uppercase;
        "
      >
        Employee Removal
      </h1>

      <form @submit.prevent="handleSearch">
        <div class="row form-group mt-5 align-items-end">
          <div class="col-2">
            <label for="text" class="">EMPLOYEE NAME</label>
            <input
              type="text"
              placeholder="Full Name"
              class="form-control"
              id="text"
              v-model="searchState.searchValue"
            />
          </div>
          <div class="col-2">
            <label for="search" class="">EMPLOYEE ID</label>

            <input
              type="number"
              maxlength="10"
              placeholder="Employee ID"
              class="form-control"
              id="number"
              @keydown="onKeyDown($event)"
              v-model="searchState.employeeId"
            />
          </div>
          <div class="col-2">
            <label for="search" class="">EMAIL</label>

            <input
              type="email"
              class="form-control"
              placeholder="Email"
              id="number"
              v-model="searchState.email"
            />
          </div>
          <div class="col-4">
            <button class="btn search-button mt-3" :disabled="loading">
              <span v-if="loading">
                <i class="fa fa-spinner fa-spin"></i> Loading...
              </span>
              <span v-else>SEARCH</span>
            </button>
            <button
              @click="fetchEmployees(pageOne)"
              class="btn clear-button mt-3"
              :disabled="loading"
              style="margin-left: 10px"
              type="reset"
            >
              <span>CLEAR</span>
            </button>
          </div>
        </div>
      </form>

      <table class="table table-striped mt-5" v-if="details">
        <thead>
          <tr>
            <th>#</th>
            <th>EMPLOYEE ID</th>
            <th>NAME</th>
            <th>POSITION</th>
            <th>SUPERVISOR</th>
            <th>DEPARTMENT</th>
            <th>REGION</th>
            <th>DATE OF HIRE</th>
            <th>EMAIL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in details" :key="detail.id">
            <td>{{ index + 1 }}</td>
            <td>{{ detail.employee_id }}</td>
            <td>{{ detail.employee_name }}</td>
            <td>{{ detail.position.position }}</td>
            <td>{{ detail.supervisor.supervisor }}</td>
            <td>{{ detail.department.department }}</td>
            <td>{{ detail.region.region }}</td>
            <td>{{ detail.date_of_hire }}</td>
            <td>{{ detail.employee_email }}</td>
            <td>
              <div class="d-flex gap-3">
                <button
                  class="btn btn-danger"
                  style="text-transform: capitalize"
                  @click="openTerminationModal(detail)"
                >
                  Terminate
                </button>
                <button
                  class="btn btn-info"
                  style="text-transform: capitalize"
                  @click="openResignationModal(detail)"
                >
                  Resignate
                </button>
                <button
                  style="text-transform: capitalize"
                  @click="openModal(detail)"
                  class="btn btn-warning"
                >
                  Suspend
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pogination :count="totalItem" @pogination="fetchEmployees" />
      <div v-if="!details && !loading" class="text-center">
        No data available.
      </div>
      <div
        v-if="details && details.length === 0 && !loading"
        class="text-center"
      >
        No results found.
      </div>
      <loading v-if="loading" />
    </div>
    <EmployeSuspend
      v-if="selectedEmployer"
      :isOpen="isModalOpen"
      :employer="selectedEmployer"
      @close="closeModal"
    />
    <EmployeResignation
      v-if="selectedResignation"
      :isOpen="isResignationOpen"
      :employer="selectedResignation"
      @close="closeResignationModal"
    />
    <EmployeTermination
      v-if="selectedTermination"
      :isOpen="isTerminationOpen"
      :employer="selectedTermination"
      :fetchEmployees="fetchEmployees"
      @close="closeTerminationModal"
    />
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import axios from "@/utils/axios";
import Loading from "@/components/Loading.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import EmployeSuspend from "../../components/EmployeSuspend.vue";
import EmployeResignation from "../../components/EmployeResignation.vue";
import EmployeTermination from "../../components/EmployeTermination.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import Pogination from "../../components/Pogination.vue";

export default {
  components: {
    Loading,
    VueDatePicker,
    EmployeSuspend,
    EmployeResignation,
    EmployeTermination,
    Pogination,
  },
  setup() {
    const searchState = reactive({
      searchValue: "",
      employeeId: "",
      email: "",
    });

    const details = ref([]);
    const loading = ref(false);
    const totalItem = ref();
    const pageOne = 1;
    const Dpage = ref(1);

    const fetchEmployees = async (page) => {
      try {
        loading.value = true;
        const response = await axios.get(
          `organization/employees/?page=${page}`
        );
        details.value = response.data.results;
        totalItem.value = response.data.count;
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        loading.value = false;
        searchState.email = "";
        searchState.employeeId = "";
        searchState.searchValue = "";
      }
    };

    const handleSearch = async () => {
      try {
        loading.value = true;
        const response = await axios.get(
          `organization/employees/?employee_name=${searchState.searchValue}&employee_id=${searchState.employeeId}&employee_email=${searchState.email}`
        );
        details.value = response.data.results;
      } catch (error) {
        console.error("Failed to search employees:", error);
      } finally {
        loading.value = false;
      }
    };

    const isModalOpen = ref(false);
    const isResignationOpen = ref(false);
    const isTerminationOpen = ref(false);
    const selectedEmployer = ref(null);
    const selectedResignation = ref(null);
    const selectedTermination = ref(null);

    const openModal = (employer) => {
      selectedEmployer.value = employer;
      isModalOpen.value = true;
    };
    const closeModal = () => {
      selectedEmployer.value = null;
      isModalOpen.value = false;
    };

    const openResignationModal = (resignation) => {
      selectedResignation.value = resignation;
      isResignationOpen.value = true;
    };

    const closeResignationModal = () => {
      selectedResignation.value = null;
      isResignationOpen.value = false;
    };

    const openTerminationModal = (termination) => {
      selectedTermination.value = termination;
      isTerminationOpen.value = true;
    };

    const closeTerminationModal = () => {
      selectedTermination.value = null;
      isTerminationOpen.value = false;
    };
    const onKeyDown = (evt) => {
      if (["e", "E", "+", "-"].includes(evt.key)) {
        evt.preventDefault();
      }
    };

    fetchEmployees(pageOne);

    return {
      selectedEmployer,
      searchState,
      details,
      handleSearch,
      loading,
      isModalOpen,
      openModal,
      closeModal,
      isResignationOpen,
      selectedResignation,
      closeResignationModal,
      openResignationModal,
      closeTerminationModal,
      openTerminationModal,
      isTerminationOpen,
      selectedTermination,
      onKeyDown,
      fetchEmployees,
      totalItem,
      Dpage,
      pageOne,
    };
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.modal-backdrop {
  display: none !important;
}
</style>
