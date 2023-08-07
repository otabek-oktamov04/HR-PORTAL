<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";
import PositionView from "../../components/positionView.vue";
import Pogination from "../../components/Pogination.vue";
import Loading from "@/components/Loading.vue";

const details = ref([]);
const isModalOpen = ref(false);
const selected = ref("all");
const options = ref("");
const isCheckMaxPosition = ref(false);
const deleteState = reactive({
  detailId: "",
  position_id: "",
  maxRemovePos: 1,
  effective_date: "",
  removePos: 1,
});

const totalItem = ref();
const pageOne = 1;
const Dpage = ref(1);
const loading = ref(false);

const onKeyDown = (evt) => {
  if (["e", "E", "+", "-"].includes(evt.key)) {
    evt.preventDefault();
  }
};

const getDepartment = async () => {
  let res = await axios.get("/organization/positions/detailed/?page_size=1000");
  options.value = res.data.results;
};

getDepartment();
const fetchPosition = async (page) => {
  loading.value = true;
  Dpage.value = page - 1;
  try {
    const response = await axios.get(
      `/organization/positions/detailed/?page=${page}`
    );
    details.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
const lookUp = async () => {
  loading.value = true;
  if (selected.value == "all") {
    fetchPosition(pageOne);
    return;
  }
  const response = await axios.get(
    `/organization/positions/${selected.value}/detailed/`
  );

  details.value = [response.data];
  totalItem.value = 1;
  loading.value = false;
};
const openDeleteModal = (det_id, pos_id, max_rem_pos) => {
  isModalOpen.value = true;
  deleteState.detailId = det_id;
  deleteState.position_id = pos_id;
  deleteState.maxRemovePos = max_rem_pos;
};

const deletePosition = async () => {
  try {
    let date = deleteState.effective_date.toISOString().slice(0, 10);
    await axios.post(
      `/organization/positions/${deleteState.position_id}/delete/`,
      {
        number_positions: deleteState.removePos,
        effective_date: date,
      }
    );
    isModalOpen.value = false;
    fetchPosition(pageOne);
    toast.success(`Positions delete success`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    toast.error(err.response.data.message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};

const handleInputRemove = () => {
  if (deleteState.removePos > deleteState.maxRemovePos) {
    isCheckMaxPosition.value = true;
  } else {
    isCheckMaxPosition.value = false;
  }
};
const activePosition = ref([]);
const isViewOpen = ref(false);
const isPositionLoading = ref(false);
const positionEmployees = ref([]);

const openPositionView = async (position) => {
  activePosition.value = position;
  isViewOpen.value = true;
  isPositionLoading.value = true;
  const response = await axios.get(
    `/organization/employees/?page_size=100&position=${position?.position.id}`
  );
  positionEmployees.value = response.data.results;
  isPositionLoading.value = false;
};

const closePositionView = () => {
  (activePosition.value = null), (isViewOpen.value = false);
};

onMounted(() => {
  fetchPosition(pageOne);
});
</script>

<template>
  <loading v-if="loading" />
  <div>
    <div
      v-if="isModalOpen"
      @click="isModalOpen = false"
      class="position-fixed top-0 left-0 w-100 h-100 bg-black"
      style="opacity: 0.5; left: 0; z-index: 9924"
    ></div>
    <div
      v-if="isModalOpen"
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
            <h3 class="modal-title text-dark">Remove Position</h3>
            <div
              @click="isModalOpen = false"
              type="button"
              class="btn-close"
            ></div>
          </div>
          <form action="">
            <div
              class="w-100 mt-3 mb-3 r p-3 d-flex flex-column justify-content-center"
            >
              <div class="mb-4">
                <label class="text-left w-100 text-dark"
                  >How many positions would you like to remove?</label
                >
                <input
                  @input="handleInputRemove"
                  v-model="deleteState.removePos"
                  max="10"
                  min="10"
                  :max="deleteState.maxRemovePos"
                  type="number"
                  @keydown="onKeyDown($event)"
                  class="form-control mx-2 mx-auto"
                />
                <h2 class="text-danger mt-2" v-if="isCheckMaxPosition">
                  Maximal remove postion: {{ deleteState.maxRemovePos }}
                </h2>
              </div>
              <div>
                <label class="text-left w-100 text-dark">Effective date</label>
                <VueDatePicker
                  v-model="deleteState.effective_date"
                  format="yyyy-MM-dd"
                  :min-date="new Date()"
                  required
                  auto-apply
                  :enable-time-picker="false"
                  placeholder="yyyy-MM-dd"
                  class="date"
                />
              </div>

              <button
                :disabled="deleteState.removePos && isCheckMaxPosition"
                @click="deletePosition()"
                type="button"
                class="btn btn-danger btn-lg mt-3 w-100 mx-auto py-2"
              >
                Remove
              </button>
            </div>
          </form>
        </div>
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
        Remove Position
      </h1>

      <form>
        <div class="row align-items-end form-group">
          <div class="col-3">
            <label for="search" class="">POSITION</label>
            <select
              id="search"
              v-model="selected"
              class="form-select"
              aria-label="Default select example"
            >
              <option value="all">All Positions</option>
              <option v-for="item in options" :value="item.id">
                {{ item.position.position }}
              </option>
            </select>
          </div>
          <div class="col-1">
            <button
              type="button"
              @click="lookUp"
              class="btn in search-button form-control"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      <table class="mb-5 table table-striped mt-5">
        <thead>
          <tr>
            <th>#</th>
            <th>POSITION NAME</th>
            <th>DEPARTMENT</th>
            <th>TEAM</th>
            <th>REGION</th>
            <th>LOCATION</th>
            <th>SUPERVISOR</th>
            <th># OF POSITIONS</th>
            <th class="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in details" :key="detail.id">
            <td>{{ index + 1 }}</td>
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
              {{ detail.region.region }}
            </td>
            <td>
              {{ detail.location.work_location }}
            </td>
            <td>
              {{ detail.supervisor.supervisor }}
            </td>
            <td class="text-center">{{ detail.number_positions }}</td>
            <td class="text-center">
              <button
                style="margin-right: 4px"
                class="btn view-button"
                @click="openPositionView(detail)"
              >
                View
              </button>
              <button
                @click="
                  openDeleteModal(detail.id, detail.id, detail.number_positions)
                "
                class="btn btn-danger"
              >
                {{ console.log(detail) }}
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <Pogination :count="totalItem" @pogination="fetchPosition" />
      <PositionView
        v-if="positionEmployees"
        :isOpen="isViewOpen"
        :isPositionLoading="isPositionLoading"
        :positionEmployees="positionEmployees || []"
        @close="closePositionView"
      />
      <div v-if="details.length == 0">
        <div class="w-100 text-center p-2">No data</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.details {
  display: flex;
  gap: 5px;
}

.modal-backdrop {
  display: none !important;
}
</style>
