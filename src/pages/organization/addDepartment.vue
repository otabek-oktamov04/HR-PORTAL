<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "@/utils/axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { toast } from "vue3-toastify";

const date = ref();

const state = reactive({
  department_name: "",
  departmentCode: "",
  effectiveDate: "",
  contract_start_date: "",
  contract_end_date: "",
});

const loading = ref(false);

const isErrorNameDep = ref("");

const createDepartment = async () => {
  try {
    loading.value = true;
    if (state.contract_end_date && state.contract_start_date) {
      await axios.post("/organization/departments/create/", {
        department_name: state.department_name,
        department_code: state.departmentCode,
        effective_date: new Date(state.effectiveDate).toLocaleDateString(
          "en-CA"
        ),
        contract_start_date: new Date(
          state.contract_start_date
        ).toLocaleDateString("en-CA"),
        contract_end_date: new Date(state.contract_end_date).toLocaleDateString(
          "en-CA"
        ),
      });
    } else {
      await axios.post("/organization/departments/create/", {
        department_name: state.department_name,
        department_code: state.departmentCode,
        effective_date: new Date(state.effectiveDate).toLocaleDateString(
          "en-CA"
        ),
      });
    }
    state.contract_end_date = "";
    state.contract_start_date = "";
    state.departmentCode = "";
    state.effectiveDate = "";
    state.department_name = "";
    toast.success("Success add department", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    console.log(err.response);
    if (err.response.status === 400) {
      toast.error("The given department code already exists in the database");
    }
    isErrorNameDep.value = err.response.data.name.message;
    toast.error(err.response.data.message);
  } finally {
    loading.value = false;
  }
};

const onKeyDown = (evt) => {
  if (["e", "E", "+", "-"].includes(evt.key)) {
    evt.preventDefault();
  }
};
const handleClear = () => {
  state.contract_end_date = "";
};
const handleInputName = () => {
  isErrorNameDep.value = "";
};
</script>
<template>
  <div class="">
    <!-- <div v-if="time" class="alert alert-success " role="alert">
      Success add department
    </div> -->
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
      Add Department
    </h1>

    <form @submit.prevent="createDepartment" class="mt-5">
      <div class="row justify-content-start">
        <div class="form-group col-4 my-3 mx-3">
          <label for="name" class="">DEPARTMENT NAME</label>
          <input
            @input="handleInputName"
            required
            type="text"
            class="form-control"
            id="name"
            v-model="state.department_name"
          />
          <h2 v-if="isErrorNameDep != ''" class="text-danger">
            {{ isErrorNameDep }}
          </h2>
        </div>
        <div class="form-group col-4 my-3 mx-3">
          <label for="number" class="">DEPARTMENT CODE</label>
          <input
            required
            type="number"
            maxlength="10"
            class="form-control"
            id="number"
            v-model="state.departmentCode"
            @keydown="onKeyDown($event)"
          />
        </div>
      </div>

      <div class="row justify-content-start">
        <div class="form-group col-4 my-3 mx-3">
          <label for="contractStart" class="">CONTRACT START</label>
          <VueDatePicker
            id="effectiveDate"
            v-model="state.contract_start_date"
            auto-apply
            :enable-time-picker="false"
            @cleared="handleClear"
            placeholder="mm/dd/yyyy"
            class="date"
          />
        </div>
        <div class="form-group col-4 my-3 mx-3">
          <label for="contractEnd" class="">CONTRACT END</label>

          <VueDatePicker
            id="effectiveDate"
            v-model="state.contract_end_date"
            auto-apply
            :min-date="state.contract_start_date"
            :enable-time-picker="false"
            :disabled="!state.contract_start_date"
            placeholder="mm/dd/yyyy"
            class="date"
          />
        </div>
      </div>
      <div class="row justify-content-start">
        <div class="form-group col-4 my-3 mx-3">
          <label for="effectiveDate" class="">EFFECTIVE DATE</label>
          <VueDatePicker
            id="effectiveDate"
            :min-date="new Date()"
            required
            v-model="state.effectiveDate"
            auto-apply
            :enable-time-picker="false"
            placeholder="mm/dd/yyyy"
            class="date"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          <div class="d-flex justify-content-start">
            <button
              :disabled="loading"
              type="submit"
              class="btn add-button form-control w-50 mt-5"
            >
              {{ loading ? "Adding" : "Add" }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style></style>
