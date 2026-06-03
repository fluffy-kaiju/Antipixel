<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="userName" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const userName = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// SSR-friendly cookie to store the bearer token
const token = useCookie('auth_token', {
  maxAge: 60 * 60 * 24 * 7,
  watch: true, 
})

const router = useRouter()

async function login() {
	console.log('Attempting login with:', userName.value, password.value)
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{ access_token: string }>('http://localhost:3000/auth/login', {
      method: 'POST',
      body: {
        userName: userName.value,
        password: password.value,
      },
    })

	console.log('Login response:', response)

    // Store the bearer token in the cookie
    token.value = response.access_token
	console.log('Login successful, token stored:', token.value)

  } catch (err: any) {
    error.value = err?.data?.message ?? 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>