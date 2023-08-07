<template>
  <div>
    <Loading v-if="loading" />
    <form @submit.prevent="createLocation" class="form my-5">
      <div class="row">
        <div class="col-4">
          <div class="form-group">
            <label for="workLocation">Work Location</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="Work Location"
              class="form-control"
              id="workLocation"
              v-model="state.work_location"
              required
            />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="region">Region</label>

            <select
              style="height: 34px"
              required
              v-model="state.details.region"
              class="form-select large"
              aria-label="Default select example"
            >
              <option v-for="item in regions" :value="item.id">
                {{ item.region }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-4">
          <div class="form-group">
            <label for="address1">Address 1</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="Address 1"
              class="form-control"
              id="address1"
              v-model="state.details.address1"
              required
            />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="address2">Address 2</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="Address 2"
              class="form-control"
              id="address2"
              v-model="state.details.address2"
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-4">
          <div class="form-group">
            <label for="city">City</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="City"
              class="form-control"
              id="city"
              v-model="state.details.city"
              required
            />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="state">State</label>
            <select
              class="form-select"
              id="state"
              v-model="state.details.state"
              required
            >
              <option value="" disabled>Select a state</option>
              <option v-for="stateOption in states" :value="stateOption[0]">
                {{ stateOption[1] }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-4">
          <div class="form-group">
            <label for="zip">ZIP</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="ZIP"
              class="form-control"
              id="zip"
              v-model="state.details.zip"
              required
              @keydown="onKeyDown"
              pattern="[0-9]{5}"
              title="Zip must be 5 digits."
              maxlength="5"
              minlength="5"
            />
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="country">Country</label>
            <input
              @input="handleInput"
              type="text"
              placeholder="Country"
              class="form-control"
              id="country"
              readonly
              v-model="state.details.country"
              required
            />
          </div>
        </div>
      </div>

      <div class="col-4 d-flex flex-column justify-content-end">
        <div class="form-group">
          <button
            :disabled="isSubmitting"
            type="submit"
            class="btn add-button form-control"
          >
            {{ isSubmitting ? "Adding" : "Add" }}
          </button>
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
          <th>Work Location</th>

          <th>City</th>
          <th>State</th>
          <th>Region</th>
          <th>Address 1</th>
          <th>Address 2</th>
          <th>ZIP</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(item, index) in data" :key="index">
          <td style="width: 30px">
            {{ Dpage * 10 + index + 1 }}
          </td>

          <td>{{ item.work_location }}</td>

          <td>{{ item?.details?.city }}</td>
          <td>{{ item?.details?.state }}</td>
          <td>
            {{ item?.details?.region?.region }} -
            {{ item?.details?.region?.region_code }}
          </td>
          <td>{{ item.details.address1 }}</td>
          <td>
            {{
              item.details.address2 ? item.details.address2 : "Not available"
            }}
          </td>
          {{
            item.details.zip
          }}
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="getData" />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import axios from "@/utils/axios";
import Loading from "@/components/Loading.vue";
import Pogination from "../../components/Pogination.vue";
import { toast } from "vue3-toastify";
import RegionSelect from "../RegionSelect.vue";
import { useRegions } from "@/api/api";

const { data: regions } = useRegions();

const data = ref();
const loading = ref(false);
const isError = ref(false);
const totalItem = ref();
const search = ref("");
const pageOne = 1;
const Dpage = ref(1);
const isSubmitting = ref(false);

const state = reactive({
  work_location: "",
  details: {
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    region: "",
  },
});

const getData = async (page, value) => {
  try {
    loading.value = true;
    Dpage.value = page - 1;
    if (!value) {
      const response = await axios.get(
        `/organization/work-locations/?page=${page}`
      );
      data.value = response.data.results;
      totalItem.value = response.data.count;
    } else {
      const response = await axios.get(
        `/organization/work-locations/?search=${value}`
      );
      data.value = response.data.results;
      totalItem.value = response.data.count;
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const createLocation = async () => {
  try {
    isSubmitting.value = true;
    if (!state.details.address2) {
      delete state.details.address2;
    }
    await axios.post("/organization/work-locations/create/", state);
    state.work_location = "";
    state.details = {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      region: "",
    };
    getData(Dpage.value + 1);
    isError.value = false;
    toast.success("Success add Location", {
      position: "top-right",
      timeout: 2000,
    });
  } catch (err) {
    if (err.response.status === 400) {
      if (err.response.data.work_location) {
        isError.value = err.response.data.work_location.message;
      }
    } else {
      isError.value = "Error adding Location. Please try again.";
    }

    toast.error(err.response.data.message);
  } finally {
    isSubmitting.value = false;
  }
};

const handleInput = () => {
  isError.value = false;
};

const searchUser = () => {
  getData(pageOne, search.value);
};

const onKeyDown = (evt) => {
  if (
    !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace"].includes(
      evt.key
    )
  ) {
    evt.preventDefault();
  }
};

onMounted(() => {
  getData(pageOne);
});

const states = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["DC", "District of Columbia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
];
</script>

<style>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
