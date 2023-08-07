<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";

const isModal = ref(false);
const details = ref([]);

const NewPosition = ref();
const denyReason = ref("");

const openModal = (item) => {
  isModal.value = true;
  NewPosition.value = item;
};

const isApproving = ref(false);
const isDenying = ref(false);

const fetchRemovePosition = async () => {
  const res = await axios.get("/organization/positions/delete/not-approved/");
  details.value = res.data.results;
};
fetchRemovePosition();

const approveRemovePosition = async () => {
  try {
    isApproving.value = true;
    await axios.post(
      `organization/positions/delete/${NewPosition.value.id}/approve/`,
      {
        approval_code: "a",
      }
    );
    isModal.value = false;
    fetchRemovePosition();
    toast.success("Remove position approved");
  } catch (err) {
    toast.error(err.response.data.message);
  } finally {
    isApproving.value = false;
  }
};

const denyRemovePosition = async () => {
  try {
    isDenying.value = true;
    await axios.post(
      `organization/positions/delete/${NewPosition.value.id}/approve/`,
      {
        approval_code: "d",
        denial_reason: denyReason.value,
      }
    );
    isModal.value = false;
    fetchRemovePosition();
  } catch (err) {
    toast.error(err.response.data.message);
    isModal.value = false;
  } finally {
    isDenying.value = false;
    toast.success("Position(s) has been denied");
  }
};
</script>

<template>
  <div>
    <div
      v-if="isModal"
      @click="isModal = false"
      class="position-fixed top-0 left-0 w-100 h-100 bg-black"
      style="opacity: 0.5; left: 0; z-index: 9924"
    ></div>
    <div
      v-if="isModal"
      class="position-fixed w-50"
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
            <div @click="isModal = false" type="button" class="btn-close"></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <form class="">
                <div class="row justify-content-start">
                  <div class="form-group col-4">
                    <label for="text" class="">POSITION</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.position.position"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">DEPARTMENT</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.department.department"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class="">TEAM</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.team.team"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class="">REGION</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.team.team"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">LOCATION</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.location.work_location"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class="">SUPERVISOR</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.supervisor.supervisor"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class=""># of POSITIONS</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.number_positions"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class="">EFFECTIVE DATE</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.effective_date"
                      class="form-control"
                      id="text"
                    />
                  </div>
                </div>
              </form>
              <div class="d-flex justify-content-between mt-5">
                <div class="w-50">
                  <input
                    type="text"
                    class="border p-2 form-control w-100"
                    placeholder="Deny reason"
                    v-model="denyReason"
                  />
                </div>

                <div>
                  <button
                    @click="approveRemovePosition()"
                    type="button"
                    class="btn btn-success mx-2"
                    :disabled="isApproving"
                  >
                    <span
                      v-if="isApproving"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Approve
                  </button>
                  <button
                    @click="denyRemovePosition()"
                    type="button"
                    class="btn btn-danger mx-2"
                    :disabled="isDenying || !denyReason"
                  >
                    <span
                      v-if="isDenying"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
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

          <td>
            {{ item.date_entered }}
          </td>
          <td>
            {{ item.submitter.first_name }}
          </td>

          <td>
            <div class="d-flex gap-3">
              <button @click="openModal(item)" class="btn view-button">
                view
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
