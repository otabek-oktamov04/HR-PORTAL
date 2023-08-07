<template>
  <div>
    <h1
      class="text-center"
      style="
        color: #f58025;
        font-weight: 600;
        font-family: 'Roboto';
        font-size: 18px;
        text-transform: uppercase;
        margin-bottom: 40px;
      "
    >
      REQUEST QUEUE
    </h1>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Data Submitted</th>
          <th>Request Type</th>
          <th>Status</th>
          <th>If Denied, Reason</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(request, index) in requestData?.results" :key="request.id">
          <td>{{ index + 1 }}</td>
          <td>{{ request.date_entered }}</td>
          <td>{{ request.request_type }}</td>
          <td>{{ request.status }}</td>
          <td>{{ request.denial_reason || "" }}</td>
          <td class="text-center">
            <button
              style="margin-right: 4px"
              class="btn view-button"
              @click="openModal(request)"
            >
              View
            </button>
            <button
              :disabled="deleteId === request.id && isDeleting"
              class="btn bs-btn"
              @click="deleteQueues(request.id)"
            >
              {{
                isDeleting && request.id == deleteId ? "Archiving" : "Archive"
              }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pogination :count="totalItem" @pogination="fetchData" />

    <!-- Modal -->
    <div class="modal" ref="myModal" tabindex="-1">
      <div
        id="modalOverlay"
        class="position-fixed top-0 left-0 w-100 h-100 bg-black"
        style="opacity: 0.5; left: 0; z-index: 9924"
      ></div>
      <div class="modal-dialog" style="z-index: 9999">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Request Details</h3>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Modal content will be dynamically populated here using Vue template -->
            <template v-if="modalRequest">
              <div v-if="modalRequest.request_type === 'new_department'">
                <div class="w-100 mt-3 mb-3 r p-3">
                  <form class="">
                    <div class="row justify-content-start">
                      <div class="form-group col-4">
                        <label for="text" class="">DEPARTMENT NAME</label>
                        <input
                          disabled
                          type="text"
                          class="form-control"
                          id="text"
                          v-model="modalRequest.data.department_name"
                        />
                      </div>
                      <div class="form-group col-4">
                        <label for="area" class="">DEPARTMENT CODE</label>
                        <input
                          v-model="modalRequest.data.department_code"
                          disabled
                          type="text"
                          class="form-control"
                          id="text"
                        />
                      </div>

                      <div class="form-group col-4">
                        <label for="text" class="">EFFECTIVE DATE</label>
                        <input
                          disabled
                          v-model="modalRequest.data.effective_date"
                          type="text"
                          class="form-control"
                          id="text"
                        />
                      </div>
                    </div>
                    <div class="row justify-content-start">
                      <div class="form-group col-4">
                        <label for="text" class="">CONTRACT START DATE</label>
                        <input
                          disabled
                          type="text"
                          class="form-control"
                          id="text"
                          v-model="modalRequest.data.contract_start_date"
                        />
                      </div>
                      <div class="form-group col-4">
                        <label for="area" class="">CONTRACT END DATE</label>
                        <input
                          v-model="modalRequest.data.contract_end_date"
                          disabled
                          type="text"
                          class="form-control"
                          id="text"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div v-else-if="modalRequest.request_type === 'new_position'">
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
                          v-model="modalRequest.data.position_name"
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
                          v-model="modalRequest.data.number_positions"
                        />
                      </div>
                      <div class="form-group col-4">
                        <label for="area" class="">FTE</label>
                        <input
                          type="text"
                          readonly
                          class="form-control"
                          id="text"
                          v-model="modalRequest.data.fte"
                        />
                      </div>
                      <div class="form-group col-4">
                        <label for="area" class="">DEPARTMENT</label>
                        <input
                          readonly
                          type="text"
                          class="form-control"
                          id="text"
                          v-model="modalRequest.data.department_name"
                        />
                      </div>
                      <div class="form-group col-4">
                        <label for="text" class="">TEAM</label>

                        <input
                          readonly
                          type="text"
                          class="form-control"
                          id="text"
                          v-model="modalRequest.data.team_name"
                        />
                      </div>

                      <div class="form-group col-4">
                        <label for="text" class=""># of POSITIONS</label>
                        <input
                          readonly
                          type="text"
                          class="form-control"
                          id="text"
                          v-model="modalRequest.data.total_number_positions"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div
                v-else-if="modalRequest.request_type === 'employee_termination'"
              >
                <div class="row">
                  <div class="form-group col-4">
                    <label for="text" class="">POSITION</label>
                    <input
                      type="text"
                      readonly
                      class="form-control"
                      id="text"
                      v-model="modalRequest.data.position_name"
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
                      v-model="modalRequest.data.number_positions"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">FTE</label>
                    <input
                      type="text"
                      readonly
                      class="form-control"
                      id="text"
                      v-model="modalRequest.data.fte"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">DEPARTMENT</label>
                    <input
                      readonly
                      type="text"
                      class="form-control"
                      id="text"
                      v-model="modalRequest.data.department_name"
                    />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class="">TEAM</label>

                    <input
                      readonly
                      type="text"
                      class="form-control"
                      id="text"
                      v-model="modalRequest.data.team_name"
                    />
                  </div>

                  <div class="form-group col-4">
                    <label for="text" class=""># of POSITIONS</label>
                    <input
                      readonly
                      type="text"
                      class="form-control"
                      id="text"
                      v-model="modalRequest.data.total_number_positions"
                    />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios";
import Pogination from "../components/Pogination.vue";
import { toast } from "vue3-toastify";
export default {
  setup() {
    const requestData = ref(null);
    const modalRequest = ref(null);
    const loading = ref(false);
    const totalItem = ref();
    const pageOne = 1;
    const Dpage = ref(1);
    const deleteId = ref("");
    const isDeleting = ref(false);

    const deleteQueues = async (requestId) => {
      isDeleting.value = true;
      deleteId.value = requestId;
      await axios
        .delete(`/organization/requests/queues/${requestId}/delete/`)
        .catch((err) => toast.error(err.response.data.message));
      toast.success("Item Deleted");
      deleteId.value = "";
      isDeleting.value = false;
      fetchData(pageOne);
    };

    const fetchData = async (page) => {
      loading.value = true;
      // Replace the endpoint with your actual backend endpoint
      const endpoint = `/organization/requests/queues/?page=${page}`;
      Dpage.value = page - 1;
      await axios
        .get(endpoint)
        .then((response) => {
          requestData.value = response.data;
          totalItem.value = response.data.count;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const openModal = (request) => {
      modalRequest.value = request;
      myModal.value.classList.add("show");
      myModal.value.style.display = "block";
      document.body.classList.add("modal-open");
    };

    const closeModal = () => {
      modalRequest.value = null;
      myModal.value.classList.remove("show");
      myModal.value.style.display = "none";
      document.body.classList.remove("modal-open");
    };

    const deleteRequest = (requestId) => {
      // Implement the delete functionality here
      console.log("Delete request with ID:", requestId);
    };

    const myModal = ref(null);

    onMounted(() => {
      fetchData(pageOne);
    });

    return {
      requestData,
      modalRequest,
      openModal,
      closeModal,
      deleteRequest,
      myModal,
      loading,
      Pogination,
      fetchData,
      totalItem,
      pageOne,
      deleteQueues,
      deleteId,
      isDeleting,
    };
  },
};
</script>

<style>
/* Add any additional styling as needed */
</style>
