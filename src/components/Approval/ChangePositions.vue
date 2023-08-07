<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";

const isModal = ref(false);
const details = ref([]);
const denyReason = ref("");
const NewPosition = ref();

const viewNewPosition = (item) => {
  isModal.value = true;
  NewPosition.value = item;
};

const fetchNewPosition = async () => {
  const res = await axios.get(
    "/organization/positions/details/changes/not-approved/"
  );
  details.value = res.data.results;
};

fetchNewPosition();

const approveChange = async () => {
  try {
    await axios.post(
      `organization/positions/details/changes/${NewPosition.value.id}/approve/`,
      {
        approval_code: "a",
      }
    );
    isModal.value = false;
    fetchNewPosition();

    toast.success(`Change Position Success Approve`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    toast.error(err.response.data.message);
  }
};

const deniedChange = async () => {
  try {
    await axios.post(
      `organization/positions/details/changes/${NewPosition.value.id}/approve/`,
      {
        approval_code: "d",
        denial_reason: denyReason.value,
      }
    );
    isModal.value = false;
    fetchNewPosition();

    toast.success(`Change Position Success Denied`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    toast.success(err.response.data.message);
    isModal.value = false;
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
            class="border-bottom d-flex justify-content-between align-items-center"
          >
            <h3 class="modal-title text-dark">New Position</h3>
            <div
              @click="isModal = false"
              type="button"
              class="btn-close p-4"
            ></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <form class="">
                <div class="row justify-content-start">
                  <div class="form-group col-4">
                    <label for="text" class="">POSITION</label>
                    <input
                      type="text"
                      readonly
                      v-model="NewPosition.position.position"
                      class="form-control"
                      id="text"
                    />
                    <p
                      class=""
                      v-if="
                        NewPosition.position_title_change?.prior_position_name
                      "
                    >
                      ({{
                        NewPosition.position_title_change.prior_position_name
                      }})
                    </p>
                  </div>

                  <div
                    v-if="
                      NewPosition.position_title_change?.total_number_positions
                    "
                    class="form-group col-4"
                  >
                    <label for="text" class="">TOTAL POSITIONS</label>
                    <input
                      type="text"
                      readonly
                      v-model="
                        NewPosition.position_title_change.total_number_positions
                      "
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div v-if="NewPosition.tier_change" class="form-group col-4">
                    <label for="area" class="">Employment Type</label>
                    <input
                      type="text"
                      readonly
                      v-model="NewPosition.tier_change.tier.tier"
                      class="form-control"
                      id="text"
                    />
                    <p
                      class=""
                      v-if="NewPosition.tier_change?.current_tier.tier"
                    >
                      ({{ NewPosition.tier_change.current_tier.tier }})
                    </p>
                  </div>
                  <div
                    v-if="NewPosition.pay_group_change"
                    class="form-group col-4"
                  >
                    <label for="area" class="">Pay Group</label>
                    <input
                      type="text"
                      readonly
                      v-model="NewPosition.pay_group_change.pay.pay_group"
                      class="form-control"
                      id="text"
                    />
                    <p
                      class=""
                      v-if="NewPosition.pay_group_change?.current_pay"
                    >
                      ({{ NewPosition.pay_group_change.current_pay.pay_group }})
                    </p>
                  </div>
                  <div
                    v-if="
                      NewPosition.position_title_change?.department.department
                    "
                    class="form-group col-4"
                  >
                    <label for="area" class="">DEPARTMENT</label>
                    <input
                      readonly
                      type="text"
                      v-model="
                        NewPosition.position_title_change.department.department
                      "
                      class="form-control"
                      id="text"
                    />
                  </div>
                  {{ console.log(NewPosition) }}
                  <div
                    v-if="NewPosition.position_title_change?.team.team"
                    class="form-group col-4"
                  >
                    <label for="text" class="">TEAM</label>
                    <input
                      readonly
                      type="text"
                      v-model="NewPosition.position_title_change.team.team"
                      class="form-control"
                      id="text"
                    />
                  </div>

                  <div
                    v-if="
                      NewPosition.position_title_change?.location.work_location
                    "
                    class="form-group col-4"
                  >
                    <label for="area" class="">LOCATION</label>
                    <input
                      readonly
                      type="text"
                      v-model="
                        NewPosition.position_title_change.location.work_location
                      "
                      class="form-control"
                      id="text"
                    />
                  </div>

                  <div
                    v-if="
                      NewPosition.position_title_change?.number_positions_add
                    "
                    class="form-group col-4"
                  >
                    <label for="text" class=""># of POSITIONS</label>
                    <input
                      readonly
                      type="text"
                      v-model="
                        NewPosition.position_title_change.number_positions_add
                      "
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
                    type="button"
                    @click="approveChange()"
                    class="btn btn-success mx-2"
                  >
                    Approve
                  </button>
                  <button
                    @click="deniedChange()"
                    type="button"
                    class="btn btn-danger mx-2"
                    :disabled="!denyReason"
                  >
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

          <td>{{ item.date_entered }}</td>
          <td>
            {{ item.submitter.first_name }}
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
