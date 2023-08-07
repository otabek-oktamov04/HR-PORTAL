<template>
  <div>
    <h1 class="mb-3 text-center value-list-title">Approvals</h1>
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
import NewPosition from "../components/Approval/NewPosition.vue";
import RemovePosition from "../components/Approval/RemovePosition.vue";
import ChangePositions from "../components/Approval/ChangePositions.vue";
import EmployeeChange from "../components/Approval/EmployeeChange.vue";
import SecondaryPosition from "../components/Approval/SecondaryPosition.vue";
import NewDepartments from "../components/Approval/NewDepartments.vue";
import RemoveDepartments from "../components/Approval/RemoveDepartments.vue";
import EmployeeRemoval from "../components/Approval/EmployeeRemoval.vue";
import Budget from "../components/Approval/Budget.vue";

const tabs = [
  { name: "New Positions", component: NewPosition },
  { name: "Remove Positions", component: RemovePosition },
  { name: "Change Positions", component: ChangePositions },
  { name: "Employee Changes", component: EmployeeChange },
  { name: "Secondary Positions", component: SecondaryPosition },
  { name: "New Departments", component: NewDepartments },
  { name: "Remove Departments", component: RemoveDepartments },
  { name: "Employee Removal", component: EmployeeRemoval },
  { name: "Budget", component: Budget },
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
