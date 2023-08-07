<script setup>
import { reactive } from "vue";
import axios from "axios";

import { useRouter } from "vue-router";

const router = useRouter();
axios.defaults.baseURL = "https://hrportal.mohirjobs.uz/api";

const state = reactive({
  username: "",
  password: "",
  error: null,
  loading: false,
});

const handleSubmit = async () => {
  state.loading = true;
  try {
    const data = await axios
      .post("/user/login/", {
        username: state.username,
        password: state.password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.data.access);
        localStorage.setItem("refreshToken", res.data.data.refresh);
        localStorage.setItem("isLoggedIn", true);
        router.push("/");
      });
  } catch (error) {
    localStorage.setItem("isLoggedIn", false);
    state.error = error.response.data.message;
  } finally {
    state.loading = false;
  }
};
</script>

<template>
  <div>
    <section class="vh-100" style="background-color: #0b2e52">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-4">
            <div class="card shadow-2-strong">
              <div class="p-3 d-flex justify-content-center">
                <img
                  src="/public/login.png"
                  class="img-fluid object-fit-cover"
                  width="400"
                  alt=""
                />
              </div>
              <div class="p-3" style="background-color: #aab5cc">
                <h4 class="text-danger text-center" v-if="state.error">
                  {{ state.error }}
                </h4>
                <form class="my-5" @submit.prevent="handleSubmit">
                  <!-- to error: add class "has-danger" -->
                  <div class="form-group mb-3">
                    <label for="exampleInputEmail1">Email address</label>
                    <input
                      required
                      v-model="state.username"
                      type="text"
                      class="form-control form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input
                      required
                      type="password"
                      v-model="state.password"
                      class="form-control form-control"
                      id="exampleInputPassword1"
                    />
                  </div>

                  <div class="">
                    <button
                      type="submit"
                      v-if="!state.loading"
                      class="btn btn-primary btn-block form-control"
                    >
                      Log in
                    </button>
                    <button
                      disabled
                      v-else
                      class="btn btn-primary btn-block form-control"
                    >
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </button>
                  </div>
                </form>

                <div class="mb-4">
                  <a
                    class="btn btn-secondary form-control d-flex justify-content-center align-items-center gap-2 fw-light"
                    href="#"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-google"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                      />
                    </svg>
                    Login With Google</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
