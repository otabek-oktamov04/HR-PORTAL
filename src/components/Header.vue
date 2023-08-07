<script setup>
import axios from "@/utils/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const logout = async () => {
  localStorage.setItem("isLoggedIn", false);
  router.push("/login");
  await axios.post("/user/logout/", {
    refresh_token: localStorage.getItem("token"),
  });
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};
</script>

<template>
  <div>
    <div class="nav-menu">
      <!-- <div></div> -->
      <!-- </div>>1</button> -->
      <div class="btn-group">
        <button
          type="button"
          class="btn btn-lg dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Xushnudbek
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <div
              @click="logout"
              class="dropdown-item d-flex justify-content-center"
              style="cursor: pointer"
              href="#"
            >
              Log out
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.nav-menu {
  background: #ededed;
  border-bottom: 1px solid #d9dee4;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 20px;
  font-size: 20px;
}
</style>
