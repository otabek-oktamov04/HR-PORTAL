<script setup>
import Terminations from "./employee/Terminations.vue";
import Resignations from "./employee/Resignations.vue";
import Suspensions from "./employee/Suspensions.vue";
import Layoffs from "./employee/Layoffs.vue";

import axios from "@/utils/axios";
import { computed, ref } from "vue";

const counts = ref({});

const ChangePositionCount = computed(() => {
  return (
    counts.value.budget_allocations_count +
    counts.value.layoff_count +
    counts.value.pay_group_changes_count +
    counts.value.position_title_changes_count +
    counts.value.supervisor_changes_count +
    counts.value.tier_changes_count
  );
});
const fetchCountApprovals = async () => {
  const res = await axios.get("/organization/positions/approvals/count/");
  counts.value = res.data;
};

fetchCountApprovals();
</script>

<template>
  <div>
    <div>
      <div class="">
        <nav>
          <div class="nav nav-tabs mb-3 gap-4" id="nav-tab" role="tablist">
            <button
              class="nav-link text-dark active px-2"
              id="nav-home-1"
              data-bs-toggle="tab"
              data-bs-target="#nav-terminations"
              type="button"
              role="tab"
              aria-controls="nav-terminations"
              aria-selected="true"
            >
              Terminations
              <!-- <span v-if="counts.pay_group_changes_count" class="badge text-caption text-bg-danger">
                {{ counts.pay_group_changes_count }}
              </span> -->
            </button>
            <button
              class="nav-link text-dark px-2"
              id="nav-home-2"
              data-bs-toggle="tab"
              data-bs-target="#nav-resignations"
              type="button"
              role="tab"
              aria-controls="nav-resignations"
              aria-selected="true"
            >
              Resignations
              <!-- <span v-if="counts.supervisor_changes_count" class="badge text-bg-danger">
                {{ counts.supervisor_changes_count }}
              </span> -->
            </button>
            <button
              class="nav-link text-dark px-2"
              id="nav-home-3"
              data-bs-toggle="tab"
              data-bs-target="#nav-suspensions"
              type="button"
              role="tab"
              aria-controls="nav-suspensions"
              aria-selected="true"
            >
              Suspensions
              <!-- <span v-if="counts.tier_changes_count" class="badge text-bg-danger">
                {{ counts.tier_changes_count }}
              </span> -->
            </button>
            <button
              class="nav-link text-dark"
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-layoffs"
              type="button"
              role="tab"
              aria-controls="nav-layoffs"
              aria-selected="true"
            >
              Layoffs
              <!-- <span v-if="counts.position_title_changes_count" class="badge text-bg-danger">
                {{ counts.position_title_changes_count }}
              </span> -->
            </button>
          </div>
        </nav>
        <div class="tab-content p-3 border bg-light" id="nav-tabContent">
          <div
            class="tab-pane show"
            id="nav-terminations"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            <Terminations />
          </div>
          <div
            class="tab-pane"
            id="nav-resignations"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <Resignations />
          </div>
          <div
            class="tab-pane"
            id="nav-suspensions"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <Suspensions />
          </div>
          <div
            class="tab-pane"
            id="nav-layoffs"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <Layoffs />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
