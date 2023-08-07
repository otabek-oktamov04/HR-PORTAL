<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";

const isModal = ref(false);
const details = ref([]);

const NewPosition = ref();

const viewBudget = (item) => {
  isModal.value = true;
  NewPosition.value = item;
};

const fetchBudget = async () => {
  const res = await axios.get(
    "organization/positions/budget-allocations/cfo-not-approved/"
  );
  details.value = res.data.results;
};

fetchBudget();

const approveBudget = async () => {
  await axios.get("organization/positions/budget-allocations/cfo-approve/");
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
            <h3 class="modal-title text-dark">Budget Allocation</h3>
            <div @click="closeModal" class="btn-close p-4"></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <form class="">
                <div class="row justify-content-start">
                  <div class="form-group col-12">
                    <label for="text" class="">Position</label>
                    <input
                      type="text"
                      v-model="NewPosition.position.position"
                      readonly
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-6">
                    <label for="area" class="">Department</label>
                    <input
                      type="text"
                      readonly
                      v-model="NewPosition.department.department"
                      class="form-control"
                      id="text"
                    />
                  </div>
                  <div class="form-group col-6">
                    <label for="text" class="">Budget allocation (%)</label>
                    <input
                      type="text"
                      readonly
                      v-model="NewPosition.budget_allocation"
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
                  />
                </div>
                <div>
                  <button
                    @click="approveBudget()"
                    type="button"
                    class="btn btn-success mx-2"
                  >
                    Approve
                  </button>
                  <button
                    @click="denyBudget()"
                    type="button"
                    class="btn btn-danger mx-2"
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

          <td>
            {{ item.updated_date }}
          </td>
          <td>
            {{ item.submitter.first_name }}
          </td>

          <td>
            <div class="d-flex gap-3">
              <button @click="viewBudget(item)" class="btn view-button">
                view
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
