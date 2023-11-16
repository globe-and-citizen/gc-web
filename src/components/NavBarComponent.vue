<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">Globe & Citizen</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/about">About</RouterLink>
        </li>
        <li>
          <RouterLink to="/about">Contact</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>
