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
        class="position-fixed"
        style="
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9925;
          width: 60vw !important;
        "
      >
        <div class="bg-white rounded">
          <div
            style="margin-bottom: 10px"
            class="bg-gray-200 rounded-t-lg d-flex align-items-center justify-content-between"
          >
            <h3 class="modal-title text-dark" style="margin-left: 10px">
              Edit Employee Details
            </h3>
            <div @click="closeModal" type="button" class="btn-close p-4"></div>
          </div>
          <div class="card p-4 modal-body py-4 px-6">
            <form @submit.prevent="submitForm">
              <div class="mb-3 d-flex w-100 gap-4">
                <label class="form-label w-50"
                  >Current Position
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    id="newTitleInput"
                    :value="employer.position.position"
                  />
                </label>
                <label for="newTitleInput" class="form-label w-50"
                  >Secondary Position

                  <select
                    v-model="formData.title_change.new_title"
                    class="form-select large"
                    aria-label="Default select example"
                    required
                  >
                    <option v-for="item in options" :value="item.id">
                      {{ item.position }}
                    </option>
                  </select>
                </label>
              </div>
              <div class="mb-3 d-flex w-100 gap-4">
                <label for="newDepartmentInput" class="form-label w-50"
                  >Current Department

                  <input
                    class="form-select large"
                    disabled
                    aria-label="Default select example"
                    :value="employer.department.department"
                  />
                </label>
                <label for="newDepartmentInput" class="form-label w-50"
                  >Secondary Department

                  <select
                    v-model="formData.department_change.new_department"
                    class="form-select large"
                    aria-label="Default select example"
                    required
                  >
                    <option v-for="item in departments" :value="item.id">
                      {{ item.department }}
                    </option>
                  </select>
                </label>
              </div>
              <div class="mb-3 d-flex w-100 gap-4">
                <label for="newDepartmentInput" class="form-label w-50"
                  >Current Location

                  <input
                    class="form-select large"
                    disabled
                    aria-label="Default select example"
                    :value="employer.location.work_location"
                  />
                </label>
                <label for="newLocationInput" class="form-label w-50"
                  >Secondary Location
                  <select
                    v-model="formData.location_change.new_location"
                    class="form-select large"
                    aria-label="Default select example"
                    required
                  >
                    <option v-for="item in locations" :value="item.id">
                      {{ item.work_location }}
                    </option>
                  </select>
                </label>
              </div>
              <div class="mb-3 d-flex w-100 gap-4">
                <label for="newDepartmentInput" class="form-label w-50"
                  >Current Region

                  <input
                    class="form-select large"
                    disabled
                    aria-label="Default select example"
                    :value="employer.region.region"
                  />
                </label>
                <label for="newLocationInput" class="form-label w-50"
                  >Secondary Region
                  <select
                    v-model="formData.region_change.new_region"
                    class="form-select large"
                    aria-label="Default select example"
                    required
                  >
                    <option v-for="item in regions" :value="item.id">
                      {{ item.region }}
                    </option>
                  </select>
                </label>
              </div>
              <div class="mb-3 d-flex w-100 gap-4">
                <label for="newDepartmentInput" class="form-label w-50"
                  >Current Supervisor

                  <input
                    class="form-select large"
                    disabled
                    aria-label="Default select example"
                    :value="employer.supervisor.supervisor"
                  />
                </label>
                <label class="form-label w-50">
                  Secondary supervisor

                  <SupervisorSelect
                    v-model="formData.supervisor_change.new_supervisor"
                    :disabled="!formData.department_change.new_department"
                    :department-id="formData.department_change.new_department"
                  />
                </label>
              </div>
              <div class="mb-3 d-flex w-100 gap-4">
                <label for="newDepartmentInput" class="form-label w-50"
                  >Current Employment Type

                  <input
                    class="form-select large"
                    disabled
                    aria-label="Default select example"
                    :value="employer.tier.tier"
                  />
                </label>
                <label class="form-label w-50">
                  Secondary Employment Type
                  <select
                    v-model="formData.tier_change.new_tier"
                    class="form-select large"
                    aria-label="Default select example"
                  >
                    <option v-for="item in tiers" :value="item.id">
                      {{ item.tier }}
                    </option>
                  </select>
                </label>
              </div>
              <div class="mb-3 d-flex w-100 gap-4">
                <label for="newDepartmentInput" class="form-label w-50"
                  >Current Pay Group

                  <input
                    class="form-select large"
                    disabled
                    aria-label="Default select example"
                    :value="employer.pay.pay_group"
                  />
                </label>
                <label class="form-label w-50">
                  Secondary Pay Group
                  <select
                    v-model="formData.pay_group_change.new_pay_group"
                    class="form-select large"
                    aria-label="Default select example"
                    @change="handleChange($event)"
                  >
                    <option v-for="item in payGroups" :value="item.id">
                      {{ item.pay_group }}
                    </option>
                  </select>
                </label>
              </div>
              <div class="d-flex gap-4 w-100">
                <div class="mb-3 w-50">
                  <label for="unionAffiliationInput" class="form-label"
                    >Union Affiliation</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="unionAffiliationInput"
                    v-model="formData.pay_group_change.union"
                    required
                    :disabled="true"
                  />
                </div>
                <div class="mb-3 w-50">
                  <label for="unionAffiliationDateInput" class="form-label"
                    >Union Affiliation Date</label
                  >

                  <VueDatePicker
                    v-model="formData.pay_group_change.union_affiliation_date"
                    id="unionAffiliationDateInput"
                    auto-apply
                    :enable-time-picker="false"
                    :disabled="formData.pay_group_change.new_pay_group !== 15"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                  />
                </div>
                <div class="mb-3 w-50">
                  <label for="effectiveDateInput" class="form-label"
                    >Effective Date</label
                  >

                  <VueDatePicker
                    v-model="formData.effective_date"
                    id="effectiveDateInput"
                    auto-apply
                    :enable-time-picker="false"
                    placeholder="mm/dd/yyyy"
                    class="date"
                    required
                  />
                </div>
              </div>
              <div class="d-flex gap-2 justify-content-end mt-4">
                <button @click="closeModal" class="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn add-button"
                  style="max-width: 70px !important"
                  :disabled="loading"
                >
                  <span v-if="loading">
                    <i class="fa fa-spinner fa-spin"></i> Loading...
                  </span>
                  <span v-else> Submit </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import {
  useDepartments,
  useSupervisors,
  useTiers,
  usePayGroups,
  useLocations,
  useRegions,
} from "../api/api";
import axios from "@/utils/axios";
import { toast } from "vue3-toastify";
import VueDatePicker from "@vuepic/vue-datepicker";
import SupervisorSelect from "../components/SupervisorSelect.vue";

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    employer: {
      type: Object, // Assuming the employee ID is of type string, adjust accordingly if necessary
      required: true,
    },
    fetchEmployees: {
      type: Function,
      required: true,
    },
  },
  components: {
    VueDatePicker,
    SupervisorSelect,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { data: departments } = useDepartments();
    const { data: supervisors } = useSupervisors();
    const { data: payGroups } = usePayGroups();
    const { data: tiers } = useTiers();
    const { data: locations } = useLocations();
    const { data: regions } = useRegions();
    const loading = ref(false);
    const formData = ref({
      title_change: {
        new_title: "",
      },
      department_change: {
        new_department: "",
      },
      location_change: {
        new_location: "",
      },
      region_change: {
        new_region: "",
      },
      supervisor_change: {
        new_supervisor: "",
      },
      tier_change: {
        new_tier: "",
      },
      pay_group_change: {
        new_pay_group: "",
        union: "union",
        union_affiliation_date: "",
      },
      effective_date: "",
    });
    const closeModal = () => {
      emit("close");
    };

    const handleChange = (event) => {
      console.log(event.currentTarget.value);
      if (event.currentTarget.value !== 15) {
        formData.value.pay_group_change.union = "union";
        formData.value.pay_group_change.union_affiliation_date = "";
      }
      if (event.currentTarget.value === "15") {
        formData.value.pay_group_change.union = "SEIU";
      }
    };

    const submitForm = async () => {
      try {
        loading.value = true;
        await axios.post(
          `organization/employees/${props.employer.id}/change/`,
          {
            ...formData.value,
            effective_date: new Date(
              formData.value.effective_date
            ).toLocaleDateString("en-CA"),
            pay_group_change: {
              ...formData.value.pay_group_change,
              union_affiliation_date: new Date(
                formData.value.pay_group_change.union_affiliation_date
              ).toLocaleDateString("en-CA"),
            },
          }
        );
        props.fetchEmployees(1);
        closeModal();
        toast.success("Data submitted successfully");
      } catch (error) {
        toast.error("Error submitting data");
        console.error("Failed to submit data:", error);
      } finally {
        loading.value = false;
      }
    };

    const options = ref();

    const getDepartment = async () => {
      let res = await axios.get("/organization/positions/no-pagination/");

      options.value = res.data;
    };

    getDepartment();

    return {
      closeModal,
      submitForm,
      departments,
      loading,
      employer: props.employer,
      supervisors,
      tiers,
      payGroups,
      formData,
      locations,
      regions,
      options,
      handleChange,
    };
  },
};
</script>

<style>
select {
  height: 28px;
}
</style>
