<template>
	<h1>Verify Email</h1>
	<p>Please check your email by entering the verification code:</p>
	<form @submit.prevent="verifyEmail">
		<input v-model="token" type="text" placeholder="Verification Code" required />
		<button type="submit">Verify</button>
		<p v-if="error" style="color: red;">{{ errorMessage }}</p>
	</form>
</template>

<script setup lang="ts">

const token = ref('');
const error = ref(false);
const errorMessage = ref('');

async function verifyEmail() {
	try {
		await $fetch('http://localhost:3000/auth/email/verify', {
			method: 'POST',
			body: { token: token.value },
		});
		alert('Email verified successfully!');
	} catch (err: any) {
		const message = err?.data?.status ?? 'Verification failed. Please try again.';
		console.error('Verification failed:', message);
		errorMessage.value = message;
		error.value = true;
	}
}

</script>