<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import axios from "@/utils/axios";
import SupervisorSelect from "@/components/SupervisorSelect.vue";
import TierSelect from "@/components/TierSelect.vue";
import PayGroupSelect from "@/components/PayGroupSelect.vue";
import DepartmentSelect from "@/components/DepartmentSelect.vue";
import JobSelect from "@/components/JobSelect.vue";
import Loading from "@/components/Loading.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Popper from "vue3-popper";
import Multiselect from "@vueform/multiselect";
import { useDepartments, useTeams, useLocations } from "@/api/api";
import { useDetailedPositions } from "@/api/api";
import { toast } from "vue3-toastify";

const { data: departments } = useDepartments();
const { data: teams } = useTeams();
const { data: locations } = useLocations();

const isModalBudget = ref(false);
const isModalDetail = ref(false);
const isModalLayoff = ref(false);
const isModalAdd = ref(false);
const selectedDep = ref([]);
const selectedPos = ref([]);
const selectedTeam = ref([]);
const positionList = ref([]);
const selectedLoc = ref([]);
const selected = ref("");

const effective_date = ref("");
const posId = ref("");

const detailsCheckbox = reactive({
  supervisor_change: false,
  position_title_change: false,
  tier_change: false,
  pay_group_change: false,
});

const state = reactive({
  budget_allocations: [
    {
      department: "",
      budget_allocation: "",
    },
  ],
  effective_date: "",
});

const newData = reactive({
  tier_change: {
    tier: null,
    effective_date: "2012-12-22", // test uchun
  },
  pay_group_change: {
    pay: null,
    effective_date: "2012-12-22", // test uchun
  },
  supervisor_change: {
    new_supervisor: null,
    comments: null,
    effective_date: "2012-12-22", // test uchun
  },
  position_title_change: {
    new_position_name: null,
    job_description_other: null,
    tier_change: "0",
    new_tier: null,
    supervisor_change: "0",
    new_supervisor: null,
    pay_group_change: "0",
    new_pay_group: null,
    headcount_change: "0",
    number_positions_add: 14,
    number_positions_remove: 14,
    total_number_positions: null,
    supervisor_approval: null,
  },
});

const updatePosition = async () => {
  try {
    await axios.post(
      `organization/positions/${onePosition.value.position.id}/details/change/`,
      {
        ...requestData.value,
        effective_date: new Date(state.effective_date).toLocaleDateString(
          "en-CA"
        ),
      }
    );
    toast.success(`Positions changed`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    refetch();
  } catch (err) {
    console.log(err);
  }
};

const requestData = ref();
const onePosition = ref();

const openEditDetail = (detail, close) => {
  requestData.value = Object.fromEntries(
    Object.entries(newData).filter(([key, value]) => detailsCheckbox[key])
  );
  onePosition.value = detail;
  isModalDetail.value = false;
  isModalAdd.value = true;
  close();
};

const add = () => {
  updatePosition();
  isModalAdd.value = false;
  detailsCheckbox.supervisor_change = false;
  detailsCheckbox.position_title_change = false;
  detailsCheckbox.tier_change = false;
  detailsCheckbox.pay_group_change = false;
  state.effective_date = null;
};

const forMultiPositions = ref([]);

watch(
  positionList,
  (value) => {
    if (value) {
      forMultiPositions.value = positionList.value.map((item) => ({
        value: item.id,
        label: item.position,
      }));
    }
  },
  { immediate: true }
);

const forMultipleDepartments = ref([]);
watch(
  departments,
  (value) => {
    if (value) {
      forMultipleDepartments.value = departments.value.map((item) => ({
        value: item.id,
        label: item.department,
      }));
    }
  },
  { immediate: true }
);
const forMultipleTeams = ref([]);

watch(
  teams,
  (value) => {
    if (value) {
      forMultipleTeams.value = teams.value.map((item) => ({
        value: item.id,
        label: item.team,
      }));
    }
  },
  { immediate: true }
);

const forMultiplelocations = ref([]);
watch(
  locations,
  (value) => {
    if (value) {
      forMultiplelocations.value = locations.value.map((item) => ({
        value: item.id,
        label: item.work_location,
      }));
    }
  },
  { immediate: true }
);

const { data: positionsData, refetch } = useDetailedPositions(
  selectedPos,
  selectedDep,
  selectedTeam,
  selectedLoc
);

const options = computed(() => positionsData.value?.positions || []);
const details = computed(() => positionsData.value?.details || []);

const openBudget = (pos_id) => {
  posId.value = pos_id;
  isModalBudget.value = true;
};

const addPositionNumber = () => {
  state.budget_allocations.push({
    department: "",
    budget_allocation: "",
  });
};
const removeItem = (index) => {
  state.budget_allocations.splice(index, 1);
};

const getDepartment = async () => {
  let res = await axios.get("organization/positions/no-pagination/");
  positionList.value = res.data;
};
getDepartment();
const totalBudget = ref(0);
const onKeyDown = (evt) => {
  if (["e", "E", "+", "-"].includes(evt.key)) {
    evt.preventDefault();
  }
};

const checkProcentBudget = computed(() => {
  totalBudget.value = 0;
  state.budget_allocations.forEach((item) => {
    totalBudget.value += Number(item.budget_allocation);
  });
  if (totalBudget.value !== 100) {
    return true;
  } else {
    return false;
  }
});

const createBudget = async () => {
  try {
    await axios.post(
      `/organization/positions/${posId.value}/budget-allocations/create/`,
      {
        ...state,
        budget_allocations:state.budget_allocations.filter((item) => item.department),
        effective_date: new Date(state.effective_date).toLocaleDateString(
          "en-CA"
        ),
      }
    );
    isModalBudget.value = false;
    toast.success(`Budget alocation success created`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    console.log(err);
  }
};

// layoff
const depId = ref("");
const teamId = ref("");
const locId = ref("");
const openModalLayoff = (pos_id, dep_id, team_id, loc_id) => {
  isModalLayoff.value = true;
  posId.value = pos_id;
  depId.value = dep_id;
  teamId.value = team_id;
  locId.value = loc_id;
};
const layoff = async () => {
  let date = effective_date.value.toISOString().slice(0, 10);

  try {
    await axios.post(`/organization/positions/${posId.value}/layoff/`, {
      team_id: teamId.value,
      department_id: depId.value,
      location_id: locId.value,
      effective_date: date,
    });
    isModalLayoff.value = false;
    toast.success(`Position layoff success`, {
      position: toast.POSITION.TOP_RIGHT,
    });
    fet;
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div>
    <div>
      <div
        v-if="isModalBudget"
        @click="isModalBudget = false"
        class="position-fixed top-0 left-0 w-100 h-100 bg-black"
        style="opacity: 0.5; left: 0; z-index: 9924"
      ></div>
      <div
        v-if="isModalBudget"
        class="position-fixed w-25"
        style="
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9925;
          width: 50% !important;
        "
      >
        <div class="bg-light" style="border-radius: 5px">
          <div class="modal-content">
            <div
              class="border-bottom d-flex justify-content-between align-items-center p-3"
            >
              <h3 class="modal-title text-dark">BUDGET</h3>
              <div
                @click="isModalBudget = false"
                type="button"
                class="btn-close"
              ></div>
            </div>
            <form action="">
              <div class="w-100 mt-3 mb-3 p-3">
                <div
                  style="display: flex; align-items: end"
                  v-for="(item, index) in state.budget_allocations"
                  :key="item"
                >
                  <div class="form-group col-4 my-3 mx-5">
                    <label for="name" class="">DEPARTMENT</label>
                    <DepartmentSelect
                      v-model="item.department"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group col-4 my-3 mx-3">
                    <label for="name" class="">BUDGET ALLOCATION (%)</label>
                    <input
                      required
                      type="number"
                      class="form-control"
                      @keydown="onKeyDown($event)"
                      id="name"
                      v-model="item.budget_allocation"
                    />
                  </div>

                  <div class="form-group col-4">
                    <button
                      v-if="state.budget_allocations.length > 1"
                      @click="removeItem(index)"
                      class="bg-transparent text-danger border-0"
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
                  </div>
                </div>

                <div style="display: flex; align-items: end">
                  <div class="form-group col-4 my-3 mx-5">
                    <label for="name" class="">EFFECTIVE DATE</label>
                    <VueDatePicker
                      v-model="state.effective_date"
                      id="effectiveDate"
                      format="yyyy-MM-dd"
                      :min-date="new Date()"
                      auto-apply
                      :enable-time-picker="false"
                      placeholder="yyyy-mm-dd"
                      class="date"
                      required
                    />
                  </div>
                </div>

                <div class="d-flex">
                  <div class="form-group col-4 my-3 mx-5"></div>
                  <div class="form-group col-4 my-3 mx-3">
                    <p
                      v-if="checkProcentBudget && totalBudget > 0"
                      class="text-danger"
                    >
                      The total budget allocation must equal 100
                    </p>
                  </div>
                </div>

                <div
                  type="button"
                  class="btn border-secondary"
                  style="
                    margin: 1rem 0 1rem 3rem;
                    width: 86px;
                    height: 30px;
                    text-transform: uppercase;
                    padding: 0;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  @click="addPositionNumber"
                >
                  + add budget
                </div>

                <div class="row">
                  <div class="d-flex">
                    <div class="col-10 mx-3">
                      <div
                        class="d-flex"
                        style="align-items: end; justify-content: space-around"
                      >
                        <button
                          :disabled="
                            checkProcentBudget || !state.effective_date || state.budget_allocations.some(
  allocation => !allocation.department
)
                          "
                          @click="createBudget()"
                          type="button"
                          class="btn in btn-primary add-button form-control mt-5"
                        >
                          ADD
                        </button>
                       
                        <div class="d-flex gap-4 align-items-center">
                          <h3 style="margin: 0">TOTAL</h3>
                          <input
                            :value="totalBudget"
                            class="form-control"
                            style="width: 100%"
                            type="text"
                            disabled
                            placeholder="Sums all Budget Allication"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div
        v-if="isModalLayoff"
        @click="isModalLayoff = false"
        class="position-fixed top-0 left-0 w-100 h-100 bg-black"
        style="opacity: 0.5; left: 0; z-index: 9924"
      ></div>
      <div
        v-if="isModalLayoff"
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
              <h3 class="modal-title text-dark">LAYOFF</h3>
              <div
                @click="isModalLayoff = false"
                type="button"
                class="btn-close"
              ></div>
            </div>
            <form action="">
              <div class="w-100 mt-3 mb-3 r p-3">
                <div class="my-2 p-1">
                  <VueDatePicker
                    v-model="effective_date"
                    id="effectiveDate"
                    format="yyyy-MM-dd"
                    :min-date="new Date()"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="yyyy-mm-dd"
                    class="date"
                  />
                </div>

                <div class="d-flex justify-content-center">
                  <button
                    @click="layoff"
                    type="button"
                    :disabled="!effective_date"
                    class="btn btn-danger btn-lg mt-3 w-100 mx-auto py-2"
                  >
                    Confirm Layoff
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div
        v-if="isModalAdd"
        @click="isModalAdd = false"
        class="position-fixed top-0 left-0 w-100 h-100 bg-black"
        style="opacity: 0.5; left: 0; z-index: 9924"
      ></div>

      <div
        v-if="isModalAdd"
        class="position-fixed scrollbar"
        style="
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9927;
          width: 70%;
          height: 100vh;
          overflow: auto;
        "
      >
        <div
          v-if="isModalAdd"
          class="position"
          style="margin: 40px auto; z-index: 9927; width: 100%"
        >
          <div class="bg-light" style="border-radius: 5px">
            <div class="modal-content">
              <div
                class="border-bottom d-flex justify-content-between align-items-center p-3"
              >
                <h3 class="modal-title text-dark">Edit Position Details</h3>
                <div
                  @click="isModalAdd = false"
                  type="button"
                  class="btn-close"
                ></div>
              </div>
              <form action="">
                <div
                  class="w-100 mt-3 mb-3 p-3 d-flex justify-content-around flex-column"
                >
                  <div class="mb-5" v-if="detailsCheckbox.tier_change">
                    <h2 style="margin-bottom: 30px;">Employment Type</h2>
                    <div class="d-flex">
                      <div class="d-flex flex-column w-25 px-5">
                        <label for="" class="">Current Employment Type</label>
                        <input
                          type="text"
                          :value="onePosition.tier.tier"
                          disabled
                          class="p-2"
                        />
                      </div>

                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="jobSent" class=""
                          >New Employment Type</label
                        >
                        <TierSelect
                          v-model="newData.tier_change.tier"
                          class="p-2"
                        />
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div class="mb-5" v-if="detailsCheckbox.pay_group_change">
                    <h2 style="margin-bottom: 30px;">Pay Group</h2>
                    <div class="d-flex align-items-center">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Current Pay Group</label>
                        <input
                          type="text"
                          :value="onePosition.pay.pay_group"
                          disabled
                          class="p-2"
                        />
                      </div>

                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="jobSent" class="">New Pay Group </label>
                        <PayGroupSelect
                          v-model="newData.pay_group_change.pay"
                          class="p-2"
                        />
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div class="mb-5" v-if="detailsCheckbox.supervisor_change">
                    <h2>Supervisor</h2>
                    <div class="d-flex align-items-center">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Current Supervisor</label>
                        <input
                          type="text"
                          :value="onePosition.supervisor.supervisor"
                          disabled
                          class="p-2"
                        />
                      </div>

                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="jobSent" class="">New Supervisor</label>
                        <SupervisorSelect
                          v-model="newData.supervisor_change.new_supervisor"
                          class="p-2"
                          :department-id="onePosition.department.id"
                        />
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div v-if="detailsCheckbox.position_title_change">
                    <h2>Position Title</h2>
                    <div class="d-flex align-items-center my-5">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Current Position Title</label>
                        <input
                          type="text"
                          :value="onePosition.position_name"
                          disabled
                          class="p-2"
                        />
                      </div>

                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="jobSent" class="">New Position Title</label>
                        <input
                          type="text"
                          v-model="
                            newData.position_title_change.new_position_name
                          "
                          class="p-2"
                          placeholder="New title"
                        />
                      </div>
                    </div>
                    <div class="d-flex align-items-center my-5">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class=""
                          >New Job Description Sent to HR</label
                        >
                        <JobSelect
                          v-model="
                            newData.position_title_change.job_description
                          "
                          class="p-2"
                        />
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Job Description Other</label>
                        <input
                          type="text"
                          :disabled="
                            newData.position_title_change.job_description !==
                            'null'
                          "
                          v-model="
                            newData.position_title_change.job_description_other
                          "
                          class="p-2"
                        />
                      </div>
                    </div>
                    <div class="d-flex align-items-center my-5">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Change in Supervisor</label>

                        <select
                          class="p-2"
                          v-model="
                            newData.position_title_change.supervisor_change
                          "
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Current Supervisor</label>

                        <input
                          :disabled="true"
                          class="p-2"
                          v-model="onePosition.supervisor.supervisor"
                        />
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">New Supervisor</label>

                        <SupervisorSelect
                          v-model="newData.position_title_change.new_supervisor"
                          :department-id="onePosition.department.id"
                          :disabled="
                            newData.position_title_change.supervisor_change ===
                            '0'
                          "
                        />
                      </div>
                    </div>

                    <div class="d-flex align-items-center my-5">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Change in Employment Type</label>

                        <select
                          class="p-2"
                          v-model="newData.position_title_change.tier_change"
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Current Employment Type</label>

                        <input
                          :disabled="true"
                          class="p-2"
                          v-model="onePosition.tier.tier"
                        />
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">New Employment Type</label>

                        <TierSelect
                          v-model="newData.position_title_change.new_tier"
                          :department-id="onePosition.department.id"
                          :disabled="
                            newData.position_title_change.tier_change === '0'
                          "
                        />
                      </div>
                    </div>

                    <div class="d-flex align-items-center my-5">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Change Pay group</label>

                        <select
                          class="p-2"
                          v-model="
                            newData.position_title_change.pay_group_change
                          "
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">Current Pay group</label>

                        <input
                          :disabled="true"
                          class="p-2"
                          v-model="onePosition.pay.pay_group"
                        />
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">New Pay group</label>

                        <PayGroupSelect
                          v-model="newData.position_title_change.new_pay_group"
                          :disabled="
                            newData.position_title_change.pay_group_change ===
                            '0'
                          "
                        />
                      </div>
                    </div>

                    <div class="d-flex align-items-center my-5">
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="jobSent" class=""
                          >Change in Head count</label
                        >

                        <select
                          class="p-2"
                          v-model="
                            newData.position_title_change.headcount_change
                          "
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class=""
                          >Current number of positions</label
                        >
                        <input
                          v-model="onePosition.number_positions"
                          type="text"
                          disabled
                          class="p-2"
                        />
                      </div>
                      <div class="d-flex flex-column text-start w-25 px-5">
                        <label for="" class="">New number of positions</label>
                        <input
                          v-model="
                            newData.position_title_change.total_number_positions
                          "
                          :disabled="
                            newData.position_title_change.headcount_change ===
                            '0'
                          "
                          type="number"
                          @keydown="onKeyDown($event)"
                          class="mt-1 p-2"
                        />
                      </div>
                      <p
                        v-if="
                          newData.position_title_change.total_number_positions
                        "
                        style="margin-top: 30px; font-weight: bold"
                      >
                      <p class="text-success" v-if=" newData.position_title_change.total_number_positions >
                          onePosition.number_positions"> {{ `You have added ${
                                newData.position_title_change
                                  .total_number_positions -
                                onePosition.number_positions
                              } new positions` }}</p>
                              <p  class="text-danger" v-if="newData.position_title_change.total_number_positions <
                          onePosition.number_positions">
{{ `You have removed ${
                                onePosition.number_positions -
                                newData.position_title_change
                                  .total_number_positions
                              }  positions` }}

                              </p>
                      
                      </p>
                    </div>
                    <div class="d-flex flex-column text-start w-25 px-5">
                      <label for="jobSent" class=""
                        >Supervisor Approved Request</label
                      >
                      <select
                        v-model.number="
                          newData.position_title_change.supervisor_approval
                        "
                        class="p-2"
                        aria-label="Default select example"
                        id="jobSent"
                      >
                        <option value="1">Yes</option>
                        <option value="2">No</option>
                      </select>
                    </div>
                    <hr />
                  </div>
                </div>
              </form>
              <div class="d-flex justify-content-end">
                <div class="form-group col-3 mx-5" style="margin-top: -13px">
                  <label for="effectiveDate" class="">EFFECTIVE DATE</label>
                  <VueDatePicker
                    v-model="state.effective_date"
                    :min-date="new Date()"
                    required
                    id="effectiveDate"
                    format="yyyy-MM-dd"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="yyyy-mm-dd"
                    class="date"
                  />
                </div>
                <button
                  @click="add"
                  type="button"
                  :disabled="!state.effective_date"
                  class="btn in add-button  my-3 mx-5 w-25"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Loading v-if="loading" />
    <div v-if="time" class="d-flex justify-content-end">
      <div class="alert alert-danger w-25" role="alert">
        {{ username }} is deleted
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
        Change Position
      </h1>

      <form>
        <div class="row align-items-center form-group mt-5">
          <div class="col-2">
            <label for="search" class="">POSITION</label>

            <Multiselect
              class="multiselect form-select form-control"
              mode="tags"
              v-model="selectedPos"
              :close-on-select="false"
              :searchable="true"
              :options="forMultiPositions"
            />
          </div>
          <div class="col-2">
            <label for="account-type" class="">DEPARTMENT</label>
            <Multiselect
              class="multiselect p-1 form-select form-control"
              mode="tags"
              v-model="selectedDep"
              :close-on-select="false"
              :searchable="true"
              :options="forMultipleDepartments"
            />
          </div>
          <div class="col-2">
            <label for="search" class="">TEAM</label>

            <Multiselect
              class="multiselect p-1 form-select form-control"
              mode="tags"
              v-model="selectedTeam"
              :close-on-select="false"
              :searchable="true"
              :options="forMultipleTeams"
            />
          </div>
          <div class="col-2">
            <label for="search" class="">LOCATION</label>

            <Multiselect
              class="multiselect p-1 form-select form-control"
              mode="tags"
              v-model="selectedLoc"
              :close-on-select="false"
              :searchable="true"
              :options="forMultiplelocations"
            />
          </div>
          <!-- <div class="col-2">
            <button type="button" @click="lookUp" class="btn in btn-primary  form-control mt-5">
              Look Up
            </button>
          </div> -->
        </div>
      </form>

      <table class="table table-striped mt-5" v-if="details">
        <thead>
          <tr>
            <th>#</th>
            <th>POSITION</th>
            <th>DEPARTMENT</th>
            <th>TEAM</th>
            <th>LOCATION</th>
          </tr>
        </thead>
        <tbody v-if="details.length > 0">
          <tr v-for="(detail, index) in details" :key="detail.id">
            <td style="width: 30px">
              <div class="details">
                {{ index + 1 }}
              </div>
            </td>
            <td>
              <div class="details">
                {{ detail.position_name }}
              </div>
            </td>
            <td>
              {{ detail.department.department }}
            </td>
            <td>
              {{ detail.team.team }}
            </td>

            <td>
              {{ detail.location.work_location }}
            </td>

            <td>
              <div class="d-flex justify-content-center gap-3">
                <Popper arrow>
                  <button class="bs-btn btn">DETAILS</button>
                  <template #content="{ close }">
                    <div class="bg-light" style="border-radius: 5px">
                      <div class="modal-content">
                        <div
                          class="border-bottom d-flex justify-content-between align-items-center p-3"
                        >
                          <h3 class="modal-title text-dark">Details</h3>
                        </div>
                        <form action="">
                          <div
                            class="w-100 mt-3 mb-3 p-3 d-flex justify-content-around flex-column"
                          >
                           
                            <div class="d-flex align-items-center">
                              <input
                                id="position_title_change"
                                type="checkbox"
                                v-model="detailsCheckbox.position_title_change"
                                style="
                                  width: 20px;
                                  height: 20px;

                                  margin-top: 0px !important;
                                "
                              />
                              <label
                                for="position_title_change"
                                class="mx-3"
                                style="
                                  font-size: 1rem !important;
                                  margin-bottom: 0 !important;
                                "
                                >Job Title</label
                              >
                            </div>
                            <div class="d-flex align-items-center">
                              <input
                                id="tier"
                                type="checkbox"
                                v-model="detailsCheckbox.tier_change"
                                style="
                                  width: 20px;
                                  height: 20px;
                                  margin-top: 0px !important;
                                "
                              />
                              <label
                                for="tier"
                                class="mx-3"
                                style="
                                  font-size: 1rem !important;
                                  margin-bottom: 0 !important;
                                "
                                >Employment Type</label
                              >
                            </div>
                            <div class="d-flex align-items-center">
                              <input
                                id="payGroup"
                                type="checkbox"
                                v-model="detailsCheckbox.pay_group_change"
                                style="
                                  width: 20px;
                                  height: 20px;
                                  margin-top: 0px !important;
                                "
                              />
                              <label
                                for="payGroup"
                                class="mx-3"
                                style="
                                  font-size: 1rem !important;
                                  margin-bottom: 0 !important;
                                "
                                >Pay Setting Group</label
                              >
                            </div>
                          </div>
                        </form>
                        <button
                          @click="openEditDetail(detail, close)"
                          type="button"
                          class="btn mx-auto mb-2 text-white"
                          style="background-color: #f58025"
                          :disabled="!detailsCheckbox.pay_group_change && !detailsCheckbox.position_title_change && !detailsCheckbox.tier_change"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </template>
                </Popper>
                <button @click="openBudget(detail.id)" class="btn bs-btn2">
                  BUDGET
                </button>

                <button
                  @click="
                    openModalLayoff(
                      detail.position.id,
                      detail.department.id,
                      detail.team.id,
                      detail.location.id
                    )
                  "
                  class="btn btn-danger"
                >
                  LAYOFF
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="details.length == 0">
        <div class="w-100 text-center p-2">No data</div>
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.scrollbar::-webkit-scrollbar {
  display: none;
}

.modal-backdrop {
  display: none !important;
}
</style>
