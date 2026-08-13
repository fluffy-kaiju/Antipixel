<template>
<div>
    <div v-if="pending">Fetching username</div>
    <div v-else-if="error">Error loading data!</div>
    <div v-else>{{ userData?.userName }}</div>

</div>

</template>

<script setup lang="ts">

const { fetchMe } = useUser()
const { data: userData, pending, error } = fetchMe();

</script>
