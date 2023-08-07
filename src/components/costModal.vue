<template>
  <div>
    <!-- Modal -->
    <div v-if="isOpen" class="inset-0 flex items-center justify-center z-50">
      <div
        id="modalOverlay"
        class="position-fixed top-0 left-0 w-100 h-100 bg-black"
        style="opacity: 0.5; left: 0; z-index: 9924"
      ></div>
      <div
        id="costModal"
        class="position-fixed w-50"
        style="
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9925;
        "
      >
        <div class="bg-white">
          <form>
            <div class="modal-content">
              <div
                class="border-bottom d-flex justify-content-between align-items-center"
              >
                <h3 class="modal-title text-dark mx-4">COST</h3>
                <div
                  @click="closeModal"
                  type="button"
                  class="btn-close p-4"
                ></div>
              </div>
              <form action="">
                <div class="w-100 mt-3 mb-3 p-3">
                  <div
                    style="display: flex; align-items: end"
                    v-for="(allocation, index) in costAllocations"
                    :key="index"
                  >
                    <div class="form-group col-4 my-3 mx-5">
                      <label for="name" class="">DEPARTMENT</label>
                      <DepartmentSelect
                        v-model="allocation.department"
                        class="form-control"
                      />
                    </div>
                    <div class="form-group col-4 my-3 mx-3">
                      <label for="name" class="">COST ALLOCATION (%)</label>
                      <input
                        required
                        type="number"
                        class="form-control"
                        v-model="allocation.cost_allocation"
                        @input="updateTotalAllocation"
                        @keydown="onKeyDown($event)"
                        id="name"
                      />
                    </div>

                    <div class="form-group col-4">
                      <button
                        @click="removeAllocation(index)"
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

                  <div
                    class="col-12"
                    style="display: flex; align-items: center"
                  >
                    <div class="form-group col-4 my-3 mx-5">
                      <label for="name" class="">EFFECTIVE DATE</label>
                      <VueDatePicker
                        id="effectiveDate"
                        format="yyyy-MM-dd"
                        :min-date="new Date()"
                        auto-apply
                        v-model="effectiveDate"
                        :enable-time-picker="false"
                        placeholder="yyyy-mm-dd"
                        class="date"
                        required
                      />
                    </div>
                    <div
                      class="col-4 text-danger"
                      v-if="totalAllocation < 100 || totalAllocation > 100"
                    >
                      The total budget allocation must equal 100
                    </div>
                  </div>

                  <button
                    type="button"
                    class="btn border-secondary"
                    style="margin: 1rem 0 1rem 3rem"
                    @click="addAllocation"
                  >
                    + add cost
                  </button>

                  <div class="row">
                    <div class="d-flex">
                      <div class="col-10 mx-3">
                        <div
                          class="d-flex"
                          style="
                            align-items: end;
                            justify-content: space-between;
                          "
                        >
                          <button
                            @click="submitForm"
                            class="btn in mt-5 add-button"
                            :disabled="
                              loading ||
                              totalAllocation < 100 ||
                              totalAllocation > 100 ||
                              !costAllocations.filter(
                                (item) => item.department
                              ) ||
                              !effectiveDate
                            "
                          >
                            ADD
                          </button>
                          <div class="d-flex gap-4 align-items-center">
                            <h3 class="mx-5">TOTAL</h3>
                            <input
                              class="form-control"
                              style="width: 100%"
                              type="text"
                              disabled
                              placeholder="Sums all Budget Allication"
                              v-model="totalAllocation"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useDepartments } from "../api/api";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";
import VueDatePicker from "@vuepic/vue-datepicker";
import DepartmentSelect from "./DepartmentSelect.vue";
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    employeeId: {
      type: String, // Assuming the employee ID is of type string, adjust accordingly if necessary
      required: true,
    },
    fetchEmployees: {
      type: Function,
      required: true,
    },
  },
  components: {
    VueDatePicker,
    DepartmentSelect,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const effectiveDate = ref("");
    const { data: departments } = useDepartments();

    const costAllocations = reactive([
      {
        department: "",
        cost_allocation: null,
      },
    ]);

    const onKeyDown = (evt) => {
      if (["e", "E", "+", "-"].includes(evt.key)) {
        evt.preventDefault();
      }
    };

    const MAX_COST_ALLOCATION = 100;

    const loading = ref(false);
    const isCostAllocationMore =
      MAX_COST_ALLOCATION <=
      costAllocations.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );

    const closeModal = () => {
      emit("close");
    };

    const submitForm = async () => {
      try {
        loading.value = true;
        await axios.post(
          `/organization/employees/${props.employeeId}/cost-allocations/create/`,
          {
            effective_date: new Date(effectiveDate.value).toLocaleDateString(
              "en-CA"
            ),
            cost_allocations: costAllocations.filter((item) => item.department),
          }
        );
        closeModal();
        toast.success("Data submitted successfully");
        props.fetchEmployees(1);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        loading.value = false;
      }
    };

    const addAllocation = () => {
      costAllocations.push({
        department: "",
        cost_allocation: null,
      });
    };

    const removeAllocation = (index) => {
      costAllocations.splice(index, 1);
    };

    const totalAllocation = computed(() => {
      return costAllocations.reduce(
        (sum, allocation) => sum + Number(allocation.cost_allocation || 0),
        0
      );
    });

    const updateTotalAllocation = () => {
      if (totalAllocation.value > 100) {
        console.log("Total allocation exceeds 100");
      }
    };

    return {
      effectiveDate,
      costAllocations,
      closeModal,
      submitForm,
      addAllocation,
      removeAllocation,
      departments,
      loading,
      totalAllocation,
      updateTotalAllocation,
      onKeyDown,
      isCostAllocationMore,
    };
  },
};
</script>

<style></style>
