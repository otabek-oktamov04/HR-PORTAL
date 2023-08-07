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

const state = reactive({
  termination_reason: "",
});

const getData = async (page) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    const response = await axios.get(
      `/organization/termination-reasons/?page=${page}`
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
    isError.value = false;
    await axios.post("/organization/termination-reasons/", state);
    state.termination_reason = "";

    getData(Dpage.value + 1);
    toast.success("Success add Termination Reason", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    if (err.response.status === 400) {
      isError.value =
        "The given termination reasons code already exists in the database";
    } else {
      isError.value = "Error happened while adding termination";
    }
  }
};

const searchUser = async (search) => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/organization/termination-reasons?search=${search}`
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
            <label for="phone">Add New Termination Reason</label>
            <input
              type="text"
              required
              @input="handleInput"
              placeholder="Termination Reason"
              class="form-control"
              id="phone"
              v-model="state.termination_reason"
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
          <th>Termination Reason</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(item, index) in data" :key="item.id">
          <td style="width: 30px">
            {{ Dpage * 10 + index + 1 }}
          </td>
          <td>
            {{ item.termination_reason }}
          </td>
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="getData" />
  </div>
</template>
