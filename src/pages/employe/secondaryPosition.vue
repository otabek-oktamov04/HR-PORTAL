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
        Secondary Position
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
              @keydown="handleKeyDown($event)"
            />
          </div>
          <div class="col-2">
            <label for="search" class="">EMPLOYEE ID</label>

            <input
              type="number"
              maxlength="10"
              @keydown="onKeyDown($event)"
              placeholder="Employee ID"
              class="form-control"
              id="number"
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
              @keydown="handleKeyDown($event)"
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
                <button @click="openEditModal(detail)" class="btn bs-btn">
                  Details
                </button>
                <button
                  @click="openModal(detail.id)"
                  class="btn btn-primary bs-btn2"
                >
                  Cost
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
    <CostModal
      v-if="selectedEmployeeId"
      :isOpen="isModalOpen"
      :employeeId="selectedEmployeeId"
      :fetchEmployees="fetchEmployees"
      @close="closeModal"
    />
    <EditSecondaryEmployer
      v-if="selectedEmployer"
      :isOpen="isEditModalOpen"
      :employer="selectedEmployer"
      :fetchEmployees="fetchEmployees"
      @close="closeEditModal"
    />
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import axios from "@/utils/axios";
import Loading from "@/components/Loading.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import CostModal from "../../components/costModal.vue";
import EditSecondaryEmployer from "../../components/EditSecondaryEmployer.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import Pogination from "../../components/Pogination.vue";

export default {
  components: {
    Loading,
    VueDatePicker,
    CostModal,
    EditSecondaryEmployer,
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

    const onKeyDown = (evt) => {
      if (evt.key === "Enter") {
        handleSearch();
      }
      if (["e", "E", "+", "-"].includes(evt.key)) {
        evt.preventDefault();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    };

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
    const isEditModalOpen = ref(false);
    const selectedEmployer = ref(null);
    const selectedEmployeeId = ref(null);

    const openModal = (employeeId) => {
      selectedEmployeeId.value = employeeId;
      isModalOpen.value = true;
    };
    const closeModal = () => {
      selectedEmployeeId.value = null;
      isModalOpen.value = false;
    };

    const openEditModal = (employer) => {
      selectedEmployer.value = employer;
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      selectedEmployer.value = null;
      isEditModalOpen.value = false;
    };

    fetchEmployees(pageOne);

    return {
      selectedEmployeeId,
      searchState,
      details,
      handleSearch,
      loading,
      isModalOpen,
      openModal,
      closeModal,
      closeEditModal,
      openEditModal,
      isEditModalOpen,
      selectedEmployer,
      onKeyDown,
      fetchEmployees,
      handleKeyDown,
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
