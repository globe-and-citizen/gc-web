<template>
  <div class="container mx-auto navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">Globe & Citizen</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#team">Team</a>
        </li>
        <li>
          <a href="#timeline">Timeline</a>
        </li>
        <li>
          <a href="#blog">Blog</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>
