<template>
  <div>
    <h1 class="mb-3 text-center value-list-title">Value Lists</h1>
    <div class="">
      <nav>
        <div class="nav nav-tabs mb-3" role="tablist">
          <div
            v-for="(tab, index) in tabs"
            style="white-space: nowrap; cursor: pointer"
            :key="index"
            :class="['nav-link', { active: activeTab === index }]"
            @click="activateTab(index)"
          >
            {{ tab.name }}
          </div>
        </div>
      </nav>
      <div class="tab-content p-3 border bg-light" id="nav-tabContent">
        <component :is="activeTabComponent" v-if="activeTabComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Import components here
import SuperVisor1 from "../components/valueLists/SuperVisor1.vue";
import PaySettings from "../components/valueLists/PaySettings.vue";
import Teams from "../components/valueLists/Teams.vue";
import Region from "../components/valueLists/Region.vue";
import Location from "../components/valueLists/Location.vue";
import TerminationType from "../components/valueLists/TerminationType.vue";
import Area from "../components/valueLists/Area.vue";
import TerminationReasons from "../components/valueLists/TerminationReasons.vue";
import Tier from "../components/valueLists/Tier.vue";
import JobDescription from "../components/valueLists/JobDescription.vue";

const tabs = [
  { name: "Supervisor", component: SuperVisor1 },
  { name: "Team", component: Teams },
  { name: "Region", component: Region },
  { name: "Location", component: Location },
  { name: "Area", component: Area },
  { name: "Pay Group", component: PaySettings },
  { name: "Termination Type", component: TerminationType },
  { name: "Job Description", component: JobDescription },
  { name: "Termination Reason", component: TerminationReasons },

  { name: "Employment Type", component: Tier },
];

const activeTab = ref(0);

const activateTab = (index) => {
  activeTab.value = index;
};

const activeTabComponent = computed(() => {
  return tabs[activeTab.value].component;
});
</script>

<style>
.value-list-title {
  color: #f58025;
  font-weight: 500 !important;
  font-family: "Roboto";
  font-size: 18px;
  text-transform: uppercase;
}

.nav-link {
  color: #f58025 !important;
  font-weight: 500 !important;
  font-family: "Roboto";
  font-size: 14px;
}
</style>
