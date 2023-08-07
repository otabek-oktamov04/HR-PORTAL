<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/utils/axios";
import DepartmentView from "../../components/DepartmentView.vue";
import Loading from "@/components/Loading.vue";
import { toast } from "vue3-toastify";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Pogination from "@/components/Pogination.vue";
import { useDepartments } from "../../api/api";

const { data: departmentList } = useDepartments();

const effective_date = ref(null);
const departments = ref([]);
const departmentsOptions = ref([]);
const isViewOpen = ref(false);
const activeDepartment = ref(null);
const totalItem = ref();
const pageOne = 1;
const Dpage = ref(1);
const departmentEmployees = ref("");
const isDepartmentLoading = ref(false);

const loading = ref(false);
const isModalOpen = ref(false);
const selectedDep = ref("all");
const time = ref(0);
const username = ref("");

const remDep = ref("");
const remDepId = ref("");

const fetchDepartment = async (page) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    const response = await axios.get(`/organization/departments/?page=${page}`);

    departments.value = response.data.results;
    departmentsOptions.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const deleteDepartment = async () => {
  let date = effective_date.value.toISOString().slice(0, 10);
  try {
    await axios.post(`/organization/departments/${remDepId.value}/delete/`, {
      effective_date: date,
    });
    toast.error(`${remDep.value} is deleted`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    toast.error(err.response.data.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
  fetchDepartment(pageOne);
  isModalOpen.value = false;
};
const openRemoveModal = (name, id) => {
  isModalOpen.value = true;
  remDep.value = name;
  remDepId.value = id;
};

const closeDepartmentView = () => {
  (activeDepartment.value = null), (isViewOpen.value = false);
};

const openDepartmentView = async (department) => {
  activeDepartment.value = department;
  isViewOpen.value = true;
  isDepartmentLoading.value = true;
  const response = await axios.get(
    `/organization/employees/?page_size=100&department=${department.id}`
  );
  departmentEmployees.value = response.data.results;
  isDepartmentLoading.value = false;
};

const lookUp = async () => {
  if (selectedDep.value == "all") {
    fetchDepartment(pageOne);
    return;
  }
  try {
    loading.value = true;
    departments.value = [];
    const response = await axios.get(
      `/organization/departments/${selectedDep.value}/`
    );

    departments.value.push(response.data);
    totalItem.value = 1
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDepartment(pageOne);
});
</script>

<template>
  <div>
    <Loading v-if="loading" />
    <div v-if="time" class="d-flex justify-content-end">
      <div class="alert alert-danger w-25" role="alert">
        {{ username }} is deleted
      </div>
    </div>

    <div
      v-if="isModalOpen"
      @click="isModalOpen = false"
      class="position-fixed top-0 left-0 w-100 h-100 bg-black"
      style="opacity: 0.5; left: 0; z-index: 9924"
    ></div>
    <div
      v-if="isModalOpen"
      class="position-fixed w-25"
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
            <h3 class="modal-title text-dark">Remove Department</h3>
            <div
              @click="isModalOpen = false"
              type="button"
              class="btn-close"
            ></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <div>
                <label for="" class="text-left w-100 text-dark"
                  >Effective date</label
                >

                <VueDatePicker
                  v-model="effective_date"
                  format="yyyy-MM-dd"
                  :min-date="new Date()"
                  required
                  auto-apply
                  :enable-time-picker="false"
                  placeholder="yyyy-MM-dd"
                  class="date"
                />
              </div>

              <div class="d-flex justify-content-center">
                <button
                  @click="deleteDepartment()"
                  type="button"
                  style="width: 100px; margin: 10px 0px auto"
                  class="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
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
        Remove Department
      </h1>

      <form>
        <div class="row align-items-end form-group">
          <div class="col-3">
            <label for="search">DEPARTMENT NAME</label>

            <select
              class="form-select form-control"
              v-model="selectedDep"
              name=""
              id=""
            >
              <option value="all">All department</option>
              <option :value="item.id" v-for="item in departmentList">
                {{ item.department }} - {{ item.department_code }}
              </option>
            </select>
          </div>
          <div class="col-1">
            <button
              type="button"
              @click="lookUp"
              class="btn in search-button form-control"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      <table class="table table-striped mt-5" v-if="departments">
        <thead>
          <tr>
            <th>#</th>
            <th>DEPARTMENT</th>
            <th>LOCATION</th>
            <th>SUPERVISOR</th>
            <th class="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(department, index) in departments" :key="department.id">
            <td style="width: 20px">{{ index + 1 }}</td>
            <td>
              {{ department.department }} - {{ department.department_code }}
            </td>
            <td>{{ department.username }}</td>
            <td>{{ department.email }}</td>
            <td class="text-center">
              <button
                class="btn view-button"
                style="margin-right: 4px"
                @click="openDepartmentView(department)"
              >
                View
              </button>
              <button
                class="btn btn-danger"
                @click="openRemoveModal(department.department, department.id)"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <Pogination :count="totalItem" @pogination="fetchDepartment" />
      <DepartmentView
        v-if="departmentEmployees"
        :isOpen="isViewOpen"
        :isDepartmentLoading="isDepartmentLoading"
        :departmentEmployees="departmentEmployees || []"
        @close="closeDepartmentView"
      />
    </div>
  </div>
</template>

<style scoped></style>
