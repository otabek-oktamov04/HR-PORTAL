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
const addingTier = ref(false);

const state = reactive({
  tier: "",
  tier_code: "",
  effective_date: "",
});

const getData = async (page) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    const response = await axios.get(`/organization/tiers/?page=${page}`);
    data.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const onKeyDown = (evt) => {
  if (["e", "E", "+", "-"].includes(evt.key)) {
    evt.preventDefault();
  }
};

const createRegion = async () => {
  try {
    addingTier.value = true;
    await axios.post("/organization/tiers/", state);
    state.tier_code = "";
    state.tier = "";
    state.effective_date = "";
    getData(Dpage.value + 1);
    isError.value = false;
    toast.success("Success add Employment Type", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    if ((err.response.status = 400)) {
      if (err.response.data.tier) {
        isError.value =
          "The given Employment type already exists in the database";
      } else {
        isError.value = "The given tier code already exists in the database";
      }
    } else {
      isError.value = "Error happened while adding Employment type";
    }
  } finally {
    addingTier.value = false;
  }
};

const searchUser = async (search) => {
  try {
    loading.value = true;
    const response = await axios.get(`/organization/tiers?search=${search}`);
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
    <form @submit.prevent="createRegion" class="form my-5">
      <div class="row flex-column">
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Add New Employment Type</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="Employment Type"
              class="form-control"
              id="phone"
              v-model="state.tier"
              required
            />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="phone">Employment Type Code</label>
            <input
              placeholder="Employment Type Code"
              class="form-control"
              id="phone"
              @keydown="onKeyDown($event)"
              v-model="state.tier_code"
              required
              maxlength="10"
            />
          </div>
        </div>

        <div class="col-4 d-flex flex-column justify-content-end">
          <div class="form-group">
            <button
              type="submit"
              class="btn add-button form-control"
              :disabled="addingTier"
            >
              <template v-if="addingTier">
                <i class="fas fa-spinner fa-spin"></i> Adding
              </template>
              <template v-else> Add</template>
            </button>
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
          <th>Employment Type</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(item, index) in data" :key="item.id">
          <td style="width: 30px">
            {{ Dpage * 10 + index + 1 }}
          </td>
          <td>{{ item.tier }} - {{ item.tier_code }}</td>
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="getData" />
  </div>
</template>
