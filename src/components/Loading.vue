<script setup></script>

<template>
  <div class="overlay">
    <span class="loader"></span>
  </div>
</template>

<style>
.overlay {
  position: fixed;
  width: calc(100% - 250px);
  margin-left: 250px;
  height: 100vh;
  background-color: rgba(0, 0, 0, .5);
  top: 0;
  left: 0;
  z-index: 9929;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  z-index: 9929;
  width: 48px;
  height: 48px;
  border: 5px solid;
  border-color: #ffffff transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>