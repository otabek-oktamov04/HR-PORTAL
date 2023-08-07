<template>
  <div class="">
    <div
      class="modal"
      id="exampleModal"
      tabindex="1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title text-dark">Add Details</h3>
            <div
              ref="closebtn"
              type="button"
              @click="isOpen = false"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></div>
          </div>
          <div class="modal-body">
            <div>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Department</th>
                    <th scope="col">Team</th>
                    <th scope="col">Region</th>
                    <th scope="col">Location</th>
                    <th scope="col">Supervisor</th>
                    <th scope="col">Employment Type</th>
                    <th scope="col">Pay Group</th>
                    <th scope="col"># of Positions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in state.details" :key="index">
                    <td scope="row">{{ index + 1 }}</td>
                    <td>
                      <DepartmentSelect v-model="item.department" required />
                    </td>
                    <td>
                      <TeamSelect
                        v-model="item.team"
                        :disabled="!item.department"
                        :department-id="item.department"
                      />
                    </td>
                    <td>
                      <RegionSelect v-model="item.region" />
                    </td>
                    <td>
                      <LocationSelect v-model="item.location" />
                    </td>
                    <td>
                      <SupervisorSelect
                        :disabled="!item.department"
                        v-model="item.supervisor"
                        :department-id="item.department"
                      />
                    </td>
                    <td>
                      <TierSelect v-model="item.tier" />
                    </td>
                    <td>
                      <PayGroupSelect v-model="item.pay" />
                    </td>
                    <td>
                      <select
                        v-if="isOpen"
                        @change="checkPositionNumber"
                        class="form-select large"
                        aria-label="Default select example"
                        v-model="item.number_positions"
                        required
                        name=""
                        id=""
                      >
                        <option
                          :value="pos"
                          v-for="pos in Number(state.total_number_positions)"
                          :key="pos"
                        >
                          {{ pos }}
                        </option>
                      </select>
                    </td>
                    <td
                      v-if="state.details.length > 1"
                      style="padding: 0 !important"
                    >
                      <button
                        @click="removeItem(index)"
                        class="bg-transparent text-danger border-0 mt-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 256 256"
                        >
                          <path
                            fill="currentColor"
                            d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-between">
                <button class="btn border-secondary" @click="addPositionNumber">
                  Add Position
                </button>
                <h2
                  class="text-danger"
                  style="font-size: 1.5rem"
                  v-if="isErrorSumPosition"
                >
                  The sum of the positions does not match the sum of the total
                  positions
                </h2>
              </div>
              <button
                type="button"
                :disabled="isErrorSumPosition || hasEmptyFields || isLoading"
                @click="createDepartment"
                class="btn add-button btn-lg mt-5 d-flex mx-auto text-center justify-content-center align-items-center"
              >
                {{ isLoading ? "Adding" : "Add" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
      Add Position
    </h1>

    <form class="mt-5">
      <div class="row justify-content-start">
        <div class="form-group col-4 my-3 mx-3">
          <label for="text" class="">POSITION TO BE ADDED</label>
          <input
            type="text"
            class="form-control"
            id="text"
            v-model="state.position_name"
          />
        </div>
        <div class="form-group col-4 my-3 mx-3">
          <label for="area" class="">AREA (Program Type)</label>
          <AreaSelect class="form-select form-control" v-model="state.area" />
        </div>
      </div>

      <div class="row justify-content-start">
        <div class="form-group col-4 my-3 mx-3">
          <label for="jobSent" class="">JOB DESCRIPTION SENT TO HR</label>
          <JobSelect
            style="height: 30px !important"
            v-model="state.job_description"
          />
        </div>
        <div class="form-group col-4 my-3 mx-3">
          <label for="textOther" class="">JOB DESCRIPTION OTHER</label>
          <input
            type="text"
            class="form-control"
            id="textOther"
            v-model="state.job_description_other"
            :disabled="state.job_description !== 'null'"
            required
          />
        </div>
      </div>
      <div class="row justify-content-start">
        <div class="form-group col-4 my-3 mx-3">
          <label for="newTotal" class="">TOTAL NUMBER OF POSITIONS </label>
          <input
            type="text"
            class="form-control"
            id="newTotal"
            maxlength="3"
            minlength="1"
            @keydown="onKeyDown($event)"
            v-model="state.total_number_positions"
          />
        </div>

        <div class="form-group col-4 my-3 mx-3">
          <label for="textOther" class="">EFFECTIVE DATE</label>

          <VueDatePicker
            id="textOther"
            v-model="state.effective_date"
            auto-apply
            :enable-time-picker="false"
            placeholder="mm/dd/yyyy"
            class="date"
            required
          />
        </div>
      </div>
      <div class="d-flex justify-content-start mx-3 my-2 col-4">
        <button
          :disabled="
            isErrorPositionName ||
            !state.position_name ||
            !state.effective_date ||
            !state.area ||
            (state.job_description === 'null' &&
              !state.job_description_other) ||
            !state.job_description
          "
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          class="btn add-button form-control mt-5"
          @click="handleClick"
        >
          ADD POSITION DETAILS
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import DepartmentSelect from "../../components/DepartmentSelect.vue";
import SupervisorSelect from "../../components/SupervisorSelect.vue";
import TeamSelect from "../../components/TeamSelect.vue";
import RegionSelect from "../../components/RegionSelect.vue";
import LocationSelect from "../../components/LocationSelect.vue";
import AreaSelect from "../../components/AreaSelect.vue";
import PayGroupSelect from "../../components/PayGroupSelect.vue";
import axios from "@/utils/axios";
import JobSelect from "../../components/JobSelect.vue";
import TierSelect from "../../components/TierSelect.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import { toast } from "vue3-toastify";

const state = reactive({
  position_name: "",
  area: "",
  job_description: "",
  effective_date: "",
  recruitment_date: "2023-07-22",
  total_number_positions: 1,
  job_description_other: "",
  status_id: 10,
  details: [
    {
      department: "",
      team: "",
      region: "",
      location: "",
      supervisor: "",
      tier: "",
      pay: "",
      number_positions: 1,
    },
  ],
});

const closebtn = ref();
const isLoading = ref(false);

const hasEmptyFields = computed(() => {
  return state.details.some(
    (item) =>
      item.department === "" ||
      item.team === "" ||
      item.region === "" ||
      item.location === "" ||
      item.supervisor === "" ||
      item.tier === "" ||
      item.pay === "" ||
      item.number_positions === ""
  );
});

const isOpen = ref(false);

const handleClick = () => {
  isOpen.value = true;
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

const createDepartment = async () => {
  try {
    isLoading.value = true;

    if (state.job_description === "null") {
      delete state.job_description;
    }
    if (!state.job_description_other) {
      delete state.job_description_other;
    }
    await axios.post("organization/positions/create/", {
      ...state,
      effective_date: new Date(state.effective_date).toLocaleDateString(
        "en-CA"
      ),
    });
    toast.success("Success add Position", {
      position: toast.POSITION.TOP_RIGHT,
    });
    state.effective_date = "";
    state.area = null;
    state.job_description_other = "";
    state.position_name = "";
    state.job_description = null;
    state.total_number_positions = "";
    state.details = [
      {
        department: "",
        team: "",
        region: "",
        location: "",
        supervisor: "",
        tier: "",
        pay: "",
        number_positions: "",
      },
    ];
  } catch (err) {
    console.log(err);
  } finally {
    isLoading.value = false;
    closebtn.value.click();
  }
};

const addPositionNumber = () => {
  state.details.push({
    department: "",
    team: "",
    region: "",
    location: "",
    supervisor: "",
    number_positions: "",
  });
};

const sum = ref(0);
const isErrorPositionName = ref(false);

const removeItem = (index) => {
  state.details.splice(index, 1);
};

const isErrorSumPosition = computed(() => {
  sum.value = 0;
  state.details.forEach((item) => {
    sum.value += Number(item.number_positions);
  });
  return Number(state.total_number_positions) !== sum.value;
});
</script>

<style scoped>
tbody td {
  text-align: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.modal {
  --bs-modal-width: 1200px;
}
</style>
