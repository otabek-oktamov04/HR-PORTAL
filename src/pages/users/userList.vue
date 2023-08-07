<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/utils/axios";
import Loading from "@/components/Loading.vue";
import DeleteModal from "../../components/DeleteModal.vue";
import Pogination from "../../components/Pogination.vue";
import ConfirmModal from "../../components/ConfirmModal.vue";
import { toast } from "vue3-toastify";
import updateRole from "./updateRole.vue";

const users = ref([]);
const search = ref("");
const loading = ref(false);
const totalItem = ref();

const isReactiveModal = ref(false);
const isDeleteModal = ref(false);
const isUserModalOpen = ref(false);
const selectedUser = ref(null);

const openUpdateModal = (user) => {
  (selectedUser.value = user), (isUserModalOpen.value = true);
};

const closeUserModal = () => {
  (selectedUser.value = null), (isUserModalOpen.value = false);
  fetchUsers(pageOne);
};

const pageOne = 1;
const Dpage = ref(1);

const fetchUsers = async (page) => {
  try {
    Dpage.value = page - 1;
    loading.value = true;
    const response = await axios.get(`/user/users/?page=${page}`);
    users.value = response.data.results;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const uname = ref("");
const uid = ref("");
const deleteUserModal = (name, id) => {
  isDeleteModal.value = true;
  uname.value = name;
  uid.value = id;
};
const reactivateUserModal = (name, id) => {
  isReactiveModal.value = true;
  uname.value = name;
  uid.value = id;
};
const reactivateUser = async () => {
  await axios.post(`/user/${uid.value}/reactivate/`);
  toast.info(`${uname.value}  status changed`, {
    position: toast.POSITION.TOP_RIGHT,
  });
  isReactiveModal.value = false;
  await fetchUsers(Dpage.value + 1);
};

const deleteUser = async () => {
  await axios.delete(`/user/${uid.value}/delete/`);
  toast.info(`${uname.value}  status changed`, {
    position: toast.POSITION.TOP_RIGHT,
  });
  isDeleteModal.value = false;
  await fetchUsers(Dpage.value + 1);
};
const searchUser = async (search) => {
  if (!search) {
    fetchUsers(pageOne);
    return;
  }
  try {
    loading.value = true;
    const response = await axios.get(`/organization/users/?search=${search}`);
    users.value = response.data.objects;
    totalItem.value = response.data.count;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers(pageOne);
});
</script>

<template>
  <div class="">
    <ConfirmModal
      :isModalOpen="isReactiveModal"
      @closeModal="isReactiveModal = false"
      @confirm="reactivateUser"
      nameButton="Confirm"
      type="success"
      titleModal="Confirm reactivated user"
    />
    <ConfirmModal
      :isModalOpen="isDeleteModal"
      @closeModal="isDeleteModal = false"
      @confirm="deleteUser"
      nameButton="Confirm"
      type="danger"
      titleModal="Confirm deactivate user"
    />
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
            <h3 class="modal-title text-dark">Reactivate User</h3>
            <button
              @click="isModalOpen = false"
              type="button"
              class="btn-close"
            ></button>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <button
                @click="reactivateUser()"
                type="button"
                class="btn btn-success btn-lg mt-3 w-100 mx-auto py-2"
              >
                Confirm Re-activate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Loading v-if="loading" />
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
        Users List
      </h1>
      <div class="form-group col-4">
        <label for="search ">Search:</label>
        <input
          v-debounce:300ms="searchUser"
          type="text"
          class="form-control"
          v-model="search"
          placeholder="First Name, Last Name ..."
          id="search"
        />
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Account</th>
            <th>Status</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr v-for="(user, index) in users" :key="user.id">
            <td>
              {{ Dpage * 10 + index + 1 }}
            </td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.account_type }}</td>

            <td>
              <span
                style="background: transparent"
                :class="user.is_deleted ? 'text-danger' : 'text-success'"
              >
                {{ user.is_deleted ? "Inactive" : "Active" }}</span
              >
            </td>
            <td class="text-center">
              <div class="d-flex gap-2 justify-content-center">
                <button
                  class="btn btn-secondary bs-btn"
                  @click="openUpdateModal(user)"
                >
                  Update Role
                </button>
                <button
                  class="btn btn-danger"
                  @click="deleteUserModal(user.email, user.id)"
                >
                  Deactivate
                </button>
                <button
                  class="btn bs-btn2"
                  @click="reactivateUserModal(user.email, user.id)"
                >
                  Re-activate
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pogination :count="totalItem" @pogination="fetchUsers" />
    <updateRole
      v-if="selectedUser"
      :isOpen="isUserModalOpen"
      :user="selectedUser"
      @close="closeUserModal"
    />
  </div>
</template>

<style></style>
