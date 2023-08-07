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
      "
    >
      Create User
    </h1>

    <div class="mx-auto">
      <form @submit.prevent="createUser" class="col-4">
        <div class="form-group">
          <label for="email" class="">Email</label>
          <input
            type="email"
            @input="handleInputEmail"
            class="form-control"
            :class="isErrorEmail ? 'border border-danger' : ''"
            id="email"
            v-model="state.email"
          />
          <h2 v-if="isErrorEmail" class="text-danger" style="font-size: 1rem">
            You have entered an invalid email address!
          </h2>
          <h2 v-if="isAlreadyEmail !== ''" class="text-danger">
            {{ isAlreadyEmail }}
          </h2>
        </div>
        <div class="form-group position-relative">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="state.password"
          />
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="text"
            minlength="4"
            v-maska
            data-maska="####"
            class="form-control"
            id="phone"
            v-model="state.phoneNumber"
          />
        </div>
        <div class="form-group">
          <label for="account-type">Account Type</label>
          <select
            required
            class="form-select form-control"
            id="account-type"
            v-model="state.accountType"
          >
            <option value="approval">Approval</option>
            <option value="admin">Admin</option>
            <option value="general">General</option>
          </select>
        </div>
        <button type="submit" class="btn add-button" :disabled="isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Add User</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "@/utils/axios";
import { vMaska } from "maska";
import { toast } from "vue3-toastify";

const state = reactive({
  email: "",
  username: "",
  password: "",
  confirmationCode: "",
  phoneNumber: "",
  accountType: "user",
  isLoading: false, // Add isLoading to the state
});

const isErrorEmail = ref(false);
const isAlreadyEmail = ref("");

const createUser = async () => {
  if (!isErrorEmail.value) {
    try {
      state.isLoading = true; // Set isLoading to true before the request

      await axios.post("user/create/", {
        email: state.email,
        username: state.email,
        password: state.password,
        phone_number: state.phoneNumber,
        account_type: state.accountType,
      });

      toast.success("Success add User", {
        position: toast.POSITION.TOP_RIGHT,
      });

      state.email = "";
      state.password = "";
      state.phoneNumber = "";
      state.accountType = "";
    } catch (err) {
      isAlreadyEmail.value = err.response.data.email[0];
    } finally {
      state.isLoading = false; // Reset isLoading after the request
    }
  }
};

const handleInputEmail = () => {
  isAlreadyEmail.value = "";
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.email)) {
    isErrorEmail.value = false;
    return true;
  }
  isErrorEmail.value = true;
  return false;
};
</script>

<style></style>
