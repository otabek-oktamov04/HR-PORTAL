<script setup>
import Header from "@/components/Header.vue";
import sidebar from "@/components/sidebar.vue";
</script>

<template>
  <div>
    <div class="d-flex">
      <div class="left bg-danger">
        <sidebar />
      </div>
      <div class="right">
        <Header />
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.right {
  width: calc(100% - 250px);
  margin-left: 250px;
}
.content {
  padding: 20px;
}
</style>
