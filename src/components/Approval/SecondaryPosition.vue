<script setup></script>

<template>
  <div>
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

          <td></td>
          <td></td>

          <td>
            <div class="d-flex gap-3">
              <button class="btn view-button">view</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
