<script setup>
import { reactive, onMounted, computed } from "vue";
import axios from "@/utils/axios";
import Loading from "@/components/Loading.vue";

const state = reactive({
  posts: [],
  currentPage: 1,
  perPage: 10,
  isLoading: false,
  searchText: "",
});

onMounted(() => {
  fetchPosts();
});

async function fetchPosts() {
  try {
    state.isLoading = true;
    const response = await axios("https://jsonplaceholder.typicode.com/posts");
    state.posts = response.data;
  } catch (err) {
    console.log(err);
  } finally {
    state.isLoading = false;
  }
}

const filteredPosts = computed(() => {
  const searchRegex = new RegExp(state.searchText, "i");
  if (state.posts.length === 0) {
    return [];
  }
  return state.posts.filter(
    (post) => post.title.match(searchRegex) || post.body.match(searchRegex)
  );
});

const currentPosts = computed(() => {
  const startIndex = (state.currentPage - 1) * state.perPage;
  const endIndex = startIndex + state.perPage;
  return filteredPosts.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / state.perPage);
});

const goToPage = (page) => {
  state.currentPage = page;
};

const previousPage = () => {
  if (state.currentPage > 1) {
    state.currentPage--;
  }
};
const nextPage = () => {
  const maxPage = Math.ceil(state.posts.length / state.perPage);
  if (state.currentPage < maxPage) {
    state.currentPage++;
  }
};
</script>

<template>
  <div>
    <div
      v-if="isModalAddPosition"
      @click="isModalAddPosition = false"
      class="position-fixed top-0 left-0 w-100 h-100 bg-black"
      style="opacity: 0.5; left: 0; z-index: 9924"
    ></div>
    <div
      v-if="isModalAddPosition"
      class="position-fixed w-75"
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
            <h3 class="modal-title text-dark">Add FTE Position</h3>
            <div
              @click="isModalAddPosition = false"
              type="button"
              class="btn-close"
            ></div>
          </div>
          <form action="">
            <div class="w-100 mt-3 mb-3 r p-3">
              <form class="">
                <div class="row justify-content-start">
                  <div class="form-group col my-3 mx-3">
                    <label for="text" class="">POSITION</label>
                    <input type="text" class="form-control" id="text" />
                  </div>
                  <div class="form-group col my-3 mx-3">
                    <label for="area" class="">AREA</label>
                    <input type="text" class="form-control" id="text" />
                  </div>
                  <div class="form-group col my-3 mx-3">
                    <label for="text" class="">TOTAL POSITIONS</label>
                    <input type="text" class="form-control" id="text" />
                  </div>
                  <div class="form-group col my-3 mx-3">
                    <label for="area" class="">FTE</label>
                    <input type="text" class="form-control" id="text" />
                  </div>
                </div>
              </form>
              <div class="d-flex justify-content-center mt-5">
                <button
                  @click="addFTEPosition()"
                  type="button"
                  class="btn btn-success btn-lg mt-3 mx-auto py-2"
                >
                  Confirm add
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
        <tr v-for="(item, index) in approval_types_table" :key="index">
          <td style="width: 30px">{{ index + 1 }}</td>

          <td></td>
          <td></td>

          <td>
            <div class="d-flex gap-3">
              <button @click="openDeleteModal()" class="btn btn-secondary">
                view
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
button {
  border-radius: 4px;
  background: transparent;
  font-size: 20px;
  border: 0;
  padding: 4px 10px;
}

button.active {
  background: rgb(19, 116, 180);
  color: aliceblue;
}

input:focus {
  outline: none;
  border: 1px solid rgb(19, 116, 180) !important;
}
</style>
