<script setup>
import { reactive, onMounted, ref } from "vue";
import axios from "@/utils/axios";
import Loading from "@/components/Loading.vue";
import Pogination from "../../components/Pogination.vue";
import { toast } from "vue3-toastify";

const data = ref();
const loading = ref(false);
const isError = ref(false);
const totalItem = ref();
const pageOne = 1;
const Dpage = ref(1);
const search = ref("");
const addingJobDesc = ref(false);

const state = reactive({
  job_description: "",
});

const getData = async (page) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    const response = await axios.get(
      `/organization/job-descriptions/?page=${page}`
    );
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const createTerminationReasons = async () => {
  try {
    addingJobDesc.value = true;
    isError.value = false;
    await axios.post("/organization/job-descriptions/", state);
    state.job_description = "";
    getData(Dpage.value + 1);
    toast.success("Success add Job Description", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    console.log(err);
    isError.value = true;
  } finally {
    addingJobDesc.value = false;
  }
};

const searchUser = async (search) => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/organization/job-descriptions?search=${search}`
    );
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const handleInput = () => {
  isError.value = false;
};

onMounted(() => {
  getData(pageOne);
});
</script>

<template>
  <div>
    <Loading v-if="loading" />
    <form @submit.prevent="createTerminationReasons" class="form my-5">
      <div class="row flex-column">
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Add New Job Description</label>
            <input
              type="tel"
              @input="handleInput"
              placeholder="Job Description"
              class="form-control"
              id="phone"
              v-model="state.job_description"
            />
          </div>
        </div>

        <div class="col-4 d-flex flex-column justify-content-end">
          <div class="form-group">
            <button
              type="submit"
              class="btn add-button form-control"
              :disabled="addingJobDesc"
            >
              <template v-if="addingJobDesc">
                <i class="fas fa-spinner fa-spin"></i> Adding
              </template>
              <template v-else> Add </template>
            </button>
          </div>
        </div>
      </div>
      <p v-if="isError" class="error-message">
        {{ state.job_description }} is already exists in database
      </p>
    </form>
    <div class="mt-5 mb-4 col-4">
      <input
        v-debounce:300ms="searchUser"
        class="form-control"
        type="text"
        v-model="search"
        placeholder="Search..."
      />
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Job Description</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(item, index) in data" :key="item.id">
          <td style="width: 30px">
            {{ Dpage * 10 + index + 1 }}
          </td>
          <td>{{ item.job_description }}</td>
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="getData" />
  </div>
</template>
