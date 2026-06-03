<template>
  <h1>Register</h1>
  <form @submit.prevent="register">
    <input v-model="userName" type="text" placeholder="Username" required />
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Register</button>
  </form>
</template>

<script setup lang="ts">

import { ref } from "vue";

const userName = ref("");
const email = ref("");
const password = ref("");

const router = useRouter();

async function register() {
  try {
    await $fetch("http://localhost:3000/auth/register", {
      method: "POST",
      body: {
        userName: userName.value,
        email: email.value,
        password: password.value,
      },
    });
    await router.push("/login");
  } catch (err) {
    console.error("Registration failed:", err);
  }
}

</script>
