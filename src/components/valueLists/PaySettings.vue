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
  pay_group: "",
  pay_group_code: "",
});

const getData = async (page) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    const response = await axios.get(`/organization/pay-groups/?page=${page}`);
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const createPay = async () => {
  try {
    await axios.post("/organization/pay-groups/", state);
    state.pay_group = "";
    state.pay_group_code = "";

    getData(Dpage.value + 1);
    isError.value = false;
    toast.success("Success add Pay Group", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    if (err.response.status === 400) {
      isError.value = "The given pay group code already exists in the database";
    } else {
      isError.value = "Error happened while adding pay group";
    }
  }
};

const searchUser = async (search) => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/organization/pay-groups?search=${search}`
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
  isError.value = "";
};

onMounted(() => {
  getData(pageOne);
});
</script>

<template>
  <div>
    <Loading v-if="loading" />
    <form @submit.prevent="createPay" class="form my-5">
      <div class="row flex-column">
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Add New Pay Group</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="Pay Group"
              class="form-control"
              id="phone"
              v-model="state.pay_group"
              required
            />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Pay Group Code</label>
            <input
              type="text"
              maxlength="10"
              placeholder="Pay Group Code"
              class="form-control"
              id="phone"
              v-model="state.pay_group_code"
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
          <th>Pay Group</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(item, index) in data" :key="item.id">
          <td style="width: 30px">
            {{ Dpage * 10 + index + 1 }}
          </td>
          <td>{{ item.pay_group }} - {{ item.pay_group_code }}</td>
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="getData" />
  </div>
</template>
