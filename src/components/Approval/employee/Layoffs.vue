<script setup></script>

<template>
  <div>
    <table class="mb-5 table table-striped mt-5">
      <thead>
        <tr>
          <th>#</th>

          <th>DATE ENTERED</th>
          <th>SUBMITTED BY</th>
          <th>POSITIOn</th>
          <th>Department</th>
          <th>Layoff Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in 8" :key="index">
          <td style="width: 30px">{{ index + 1 }}</td>

          <td>data 2023-06-12</td>
          <td>admin@gmail.com</td>
          <td>none</td>
          <td>none</td>
          <td>none</td>

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
