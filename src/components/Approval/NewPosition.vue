<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";
import Loading from "@/components/Loading.vue";

const isModalAddPosition = ref(false);
const details = ref([]);
const denyReason = ref("");
const isSubmittingDeny = ref(false);
const isSubmittingApprove = ref(false);
const loading = ref(false);

const NewPosition = ref();

const viewNewPosition = (item) => {
  isModalAddPosition.value = true;
  NewPosition.value = item;
};

const fetchNewPosition = async () => {
  loading.value = true;
  const res = await axios.get("organization/positions/not-approved/");
  details.value = res.data.results;
  loading.value = false;
};

fetchNewPosition();

const addFTEPosition = async () => {
  isSubmittingApprove.value = true;
  try {
    if (NewPosition) {
      await axios.post(
        `organization/positions/${NewPosition.value.position.id}/create-approve/`,
        {
          approval_code: "a",
          detail_id: NewPosition.value.id,
        }
      );
      fetchNewPosition();
      isModalAddPosition.value = false;
      toast.success("New position has successfully been approved");
    }
  } catch (err) {
    toast.error(err.response.data.message);
  } finally {
    isSubmittingApprove.value = false;
  }
};

const denyFTEPosition = async () => {
  isSubmittingDeny.value = true;
  try {
    if (NewPosition) {
      await axios.post(
        `organization/positions/${NewPosition.value.position.id}/create-approve/`,
        {
          detail_id: NewPosition.value.id,
          approval_code: "d",
          denial_reason: denyReason.value,
        }
      );
    }
  } catch (err) {
    toast.error(err.response.data.message);
  } finally {
    isSubmittingDeny.value = false;
    fetchNewPosition();
    isModalAddPosition.value = false;
    toast.success("New Position has been denied");
  }
};

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(date);
  return formattedDate + " " + formattedTime;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
</script>

<template>
  <Loading v-if="loading" />
  <div>
    <div
      v-if="isModalAddPosition"
      @click="isModalAddPosition = false"
      class="position-fixed top-0 left-0 w-100 h-100 bg-black"
      style="opacity: 0.5; left: 0; z-index: 9924"
    ></div>
    <div
      v-if="isModalAddPosition"
      class="position-fixed w-50"
      style="
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9925;
      "
    >
      <div class="bg-light" style="border-radius: 5px">
        <div
          class="border-bottom d-flex justify-content-between align-items-center p-3"
        >
          <h3 class="modal-title text-dark">Add Position</h3>
          <div
            @click="isModalAddPosition = false"
            type="button"
            class="btn-close"
          ></div>
        </div>
        <form action="">
          <div class="w-100 mt-3 mb-3 r p-3">
            <form class="">
              <div class="row">
                <div class="form-group col-4">
                  <label for="text" class="">POSITION</label>
                  <input
                    type="text"
                    readonly
                    class="form-control"
                    id="text"
                    v-model="NewPosition.position.position_name"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="area" class="">AREA</label>
                  <input
                    type="text"
                    readonly
                    class="form-control"
                    id="text"
                    placeholder="Not Available"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="text" class="">TOTAL POSITIONS</label>
                  <input
                    type="text"
                    readonly
                    class="form-control"
                    id="text"
                    v-model="NewPosition.number_positions"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="area" class="">FTE</label>
                  <input
                    type="text"
                    readonly
                    class="form-control"
                    id="text"
                    v-model="NewPosition.fte"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="area" class="">DEPARTMENT</label>
                  <input
                    readonly
                    type="text"
                    class="form-control"
                    id="text"
                    v-model="NewPosition.department.department"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="text" class="">TEAM</label>
                  {{ console.log(NewPosition) }}
                  <input
                    readonly
                    type="text"
                    class="form-control"
                    id="text"
                    v-model="NewPosition.team.team"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="text" class="">REGION</label>
                  <input
                    readonly
                    type="text"
                    class="form-control"
                    id="text"
                    v-model="NewPosition.region.region"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="area" class="">LOCATION</label>
                  <input
                    readonly
                    type="text"
                    class="form-control"
                    id="text"
                    v-model="NewPosition.location.work_location"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="text" class="">SUPERVISOR</label>
                  <input
                    readonly
                    type="text"
                    class="form-control"
                    id="text"
                    v-model="NewPosition.supervisor.supervisor"
                  />
                </div>
                <div class="form-group col-4">
                  <label for="text" class=""># of POSITIONS</label>
                  <input
                    readonly
                    type="text"
                    class="form-control"
                    id="text"
                    v-model="NewPosition.number_positions"
                  />
                </div>
                <div class="form-group col-12">
                  <label for="denyReason" class="">Deny Reason</label>

                  <textarea
                    v-model="denyReason"
                    id="denyReason"
                    class="form-control"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </form>
            <div class="d-flex justify-content-center mt-5">
              <button
                @click="addFTEPosition()"
                :disabled="isSubmittingApprove"
                class="btn btn-success btn-lg mt-3 py-2"
              >
                <span
                  v-if="isSubmittingApprove"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Approve
              </button>
              <button
                @click="denyFTEPosition()"
                :disabled="!denyReason || isSubmittingDeny"
                class="btn btn-danger btn-lg mt-3 mx-2 py-2"
              >
                <span
                  v-if="isSubmittingDeny"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Deny
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <table class="mb-5 table table-striped mt-5">
      <thead>
        <tr>
          <th>#</th>

          <th>DATE ENTERED</th>
          <th>SUBMITTED BY</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in details" :key="index">
          <td style="width: 30px">{{ index + 1 }}</td>

          <td>{{ formatDateTime(item.position.date_entered) }}</td>

          <td>
            {{ item.position.submitter.first_name }}
          </td>

          <td>
            <div class="d-flex gap-3">
              <button @click="viewNewPosition(item)" class="btn view-button">
                view
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
