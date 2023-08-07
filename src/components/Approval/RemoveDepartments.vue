<script setup>
import { ref } from "vue";

const isModal = ref(false);
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
            <h3 class="modal-title text-dark">Remove Department</h3>
            <div @click="isModal = false" type="button" class="btn-close"></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <form class="">
                <div class="row justify-content-start">
                  <div class="form-group col-4">
                    <label for="text" class="">DEPARTMENT NAME</label>
                    <input type="text" class="form-control" id="text" />
                  </div>
                  <div class="form-group col-4">
                    <label for="area" class="">DEPARTMENT CODE</label>
                    <input type="text" class="form-control" id="text" />
                  </div>
                  <div class="form-group col-4">
                    <label for="text" class="">EFFECTIVE DATE</label>
                    <input type="text" class="form-control" id="text" />
                  </div>
                </div>
              </form>
              <div class="d-flex justify-content-center mt-5">
                <button
                  type="button"
                  class="btn btn-danger btn-lg mt-3 mx-auto py-2"
                >
                  Confirm remove
                </button>
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
        <tr v-for="(item, index) in 5" :key="index">
          <td style="width: 30px">{{ index + 1 }}</td>

          <td>{{ item.data_entered }}</td>
          <td>{{ item?.submitter?.first_name }}</td>

          <td>
            <div class="d-flex gap-3">
              <button @click="isModal = true" class="btn btn-secondary">
                view
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
