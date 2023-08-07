import { createApp } from "vue";
import App from "./App.vue";
import { vue3Debounce } from "vue-debounce";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import SidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "@fortawesome/fontawesome-free/css/all.css";
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Popper from "vue3-popper";
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import '@/assets/style.css'
import { VueQueryPlugin } from "@tanstack/vue-query";
const app = createApp(App);

const vueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: { queries: { staleTime: 1000 * 60 } },
  },
}


app.component("VueDatePicker", VueDatePicker);
app.component("Popper", Popper);

app.use(
  Vue3Toasity,
  {
    autoClose: 3000,
    toastStyle: {
      fontSize: '15px',
    },
  },
);
app.use(VueQueryPlugin, vueQueryPluginOptions)
app.use(router);
app.directive("debounce", vue3Debounce({ lock: true }));
app.use(SidebarMenu);
app.use(VueAwesomePaginate);

app.mount("#app");
