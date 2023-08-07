<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";

const details = ref([]);
const isModalOpen = ref(false);
const selected = ref("all");
const options = ref("");
const isCheckMaxPosition = ref(false);
const detailId = ref("");
const fte = ref("1.0");
const loading = ref(false);

const fetchPosition = async () => {
  loading.value = true;
  const response = await axios.get("/organization/positions/no-fte/");
  options.value = response.data.results.map((item) => ({
    id: item.id,
    name: item.position_name,
  }));
  details.value = response.data.results;
  loading.value = false;
  // .flatMap((position) =>
  //   position.details.map((detail) => ({
  //     ...detail,

  //     position_name: position.position_name,
  //     position_id: position.id,
  //   }))
  // );
};
const lookUp = async () => {
  if (selected.value == "all") {
    fetchPosition();
    return;
  }
  const response = await axios.get(
    `/organization/positions/${selected.value}/detailed/`
  );
  // options.value = response.data
  const newArray = response.data.details.map((item) => ({
    ...item,
    position_name: response.data.position_name,
    position_id: response.data.id,
  }));
  details.value = newArray;
  // details.value = response.data.flatMap((position) => position.details.map(detail => ({ ...detail, position_name: position.position_name, position_id: position.position_id })))
};
const openDeleteModal = (id, fte) => {
  isModalOpen.value = true;
  detailId.value = id;
  fte.value = fte;
};
const addFTEPosition = async () => {
  try {
    await axios.post(`/organization/positions/fte/add/`, {
      detail_id: detailId.value,
      fte: fte.value,
    });
    isModalOpen.value = false;
    fetchPosition();
    toast.success("Success FTE Position", {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    console.log(err);
  }
};

const handleInputRemove = () => {
  if (deleteState.removePos > deleteState.maxRemovePos) {
    isCheckMaxPosition.value = true;
  } else {
    isCheckMaxPosition.value = false;
  }
};

onMounted(() => {
  fetchPosition();
});
</script>

<template>
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
            <h3 class="modal-title text-dark">FTE Position</h3>
            <div
              @click="isModalOpen = false"
              type="button"
              class="btn-close"
            ></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <button
                @click="addFTEPosition()"
                type="button"
                class="btn add-button btn-lg mt-3 w-100 mx-auto py-2"
              >
                Confirm add
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
        FTE
      </h1>

      <!-- <form>
        <div class="row align-items-center form-group">
          <div class="col-3">
            <label for="search" class="">POSITION</label>
            <select id="search" v-model="selected" @change="handleChange"
              class="form-select form-control  " aria-label="Default select example">
              <option value="all">All Positions</option>
              <option v-for="item in options" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="col-1">
            <button type="button" @click="lookUp" class="btn in btn-primary  form-control mt-5">
              Look Up
            </button>
          </div>
        </div>
      </form> -->

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
            <th>FTE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in details" :key="detail.id">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="details">
                {{ detail.position.position_name }}
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
            <td>
              <select
                class="p-1"
                style="border-radius: 4px"
                v-model.nmber="detail.fte"
              >
                <option value="1.0">1.0</option>
                <option value="0.5">0.5</option>
              </select>
            </td>
            <td>
              <div class="d-flex gap-3">
                <button
                  @click="openDeleteModal(detail.id, detail.fte)"
                  class="btn add-button"
                  :disabled="!detail.fte"
                >
                  Add
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
