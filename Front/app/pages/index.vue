<template>

  <h1>Index page</h1>
  <p>{{ test ?? 'Fetching...' }}</p>

</template>

<script setup lang="ts">
const token = useCookie('auth_token')
const test = ref('')

try {
	const response = await $fetch<string>('http://localhost:3000/antipixels', {
		headers: {
			Authorization: `Bearer ${token.value}`,
		},
	})
	test.value = response
} catch (error: any) {
	console.error('Error fetching antipixels:', error)
	test.value = error?.data?.message ?? 'Failed to fetch antipixels'
}

</script>