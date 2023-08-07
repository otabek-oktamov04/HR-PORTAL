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

const search = ref("");
const pageOne = 1;
const Dpage = ref(1);

const state = reactive({
  region: "",
  region_code: "",
});

const getData = async (page) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    const response = await axios.get(`/organization/regions/?page=${page}`);
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const createRegion = async () => {
  try {
    await axios.post("/organization/regions/", state);
    state.region = "";
    state.region_code = "";
    getData(Dpage.value + 1);
    isError.value = false;
    toast.success("Success add Region", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) {
      isError.value = "The given region code already exists in the database";
    } else {
      isError.value = "Error happened while adding region";
    }
  }
};

const searchUser = async (search) => {
  try {
    loading.value = true;
    const response = await axios.get(`/organization/regions?search=${search}`);
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const handleInput = () => {
  isError.value = "";
};
onMounted(() => {
  getData(pageOne);
});
</script>

<template>
  <div>
    <Loading v-if="loading" />
    <form @submit.prevent="createRegion" class="form my-5">
      <div class="row flex-column">
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Add New Region</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="Region"
              class="form-control"
              id="phone"
              v-model="state.region"
              required
            />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Region Code</label>
            <input
              type="text"
              maxlength="10"
              placeholder="Region Code"
              class="form-control"
              id="phone"
              v-model="state.region_code"
              required
            />
          </div>
        </div>

        <div class="col-4 d-flex flex-column justify-content-end">
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
          <th>Region</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(item, index) in data" :key="item.id">
          <td style="width: 30px">
            {{ Dpage * 10 + index + 1 }}
          </td>
          <td>{{ item.region }} - {{ item.region_code }}</td>
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="getData" />
  </div>
</template>
