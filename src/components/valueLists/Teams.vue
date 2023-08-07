<script setup>
import { reactive, onMounted, ref } from "vue";
import axios from "@/utils/axios";
import DepartmentSelect from "../DepartmentSelect.vue";
import Loading from "@/components/Loading.vue";
import Pogination from "../../components/Pogination.vue";
import Multiselect from "@vueform/multiselect";
import { toast } from "vue3-toastify";

const data = ref();
const isError = ref(false);
const loading = ref(false);
const totalItem = ref();
const pageOne = 1;
const Dpage = ref(1);
const search = ref("");

const state = reactive({
  team: "",

  departments: [],
});
const depOptions = ref();
const getData = async (page) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    const response = await axios.get(`/organization/teams/?page=${page}`);
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const createTeam = async () => {
  try {
    await axios.post("/organization/teams/", state);
    state.team = "";

    state.departments = [];
    isError.value = false;
    getData(Dpage.value + 1);
    toast.success("Success add Team", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    if (err.response.status === 400) {
      isError.value =
        "The given team already exists in the department provided";
    } else {
      isError.value = err.response.data.message;
    }
  }
};

const searchUser = async (search) => {
  try {
    loading.value = true;
    const response = await axios.get(`/organization/teams?search=${search}`);
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const getDepartment = async (page) => {
  try {
    let res = await axios.get("/organization/departments?page_size=100");
    // let deps = res.data.results.filter((item) => {
    //   return !item.is_deleted;
    // });

    depOptions.value = res.data.results.map((item) => ({
      value: item.id,
      label: item.department,
    }));
  } catch (err) {
    console.log(err);
  }
};

const handleInput = () => {
  isError.value = "";
};

onMounted(() => {
  getData(pageOne);
  getDepartment();
});
</script>

<template>
  <div>
    <Loading v-if="loading" />
    <form @submit.prevent="createTeam" class="form my-5">
      <div class="row align-items-start flex-column">
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Add New Team</label>
            <input
              type="text"
              @input="handleInput"
              placeholder="Team"
              class="form-control"
              id="phone"
              v-model="state.team"
              required
            />
          </div>
        </div>

        <div class="col-4">
          <div class="form-group">
            <label for="account-type">Choose Department</label>
            <!-- <Multiselect
              mode="tags"
              v-model="state.departments"
              :close-on-select="false"
              :searchable="true"
              :options="depOptions"
              required
            /> -->

            <DepartmentSelect v-model="state.departments" />
          </div>
        </div>
        <div class="col-6 d-flex flex-column justify-content-end">
          <div class="form-group">
            <button type="" class="btn add-button form-control">Add</button>
          </div>
        </div>
      </div>
      <p v-if="isError" class="error-message">
        {{ isError }}
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
          <th>Team</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(team, index) in data" :key="team.id">
          <td style="width: 30px">
            {{ Dpage * 10 + index + 1 }}
          </td>
          <td style="width: 30%">{{ team.team }}</td>
          <td>
            <span style="margin-right: 20px">
              {{ team.department.department }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="getData" />
  </div>
</template>
