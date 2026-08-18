<template>
    <p v-if="pending">Loading antipixels...</p>
    <div v-else-if="error">
        <p>Something went wrong fetching data.</p>
        <p v-if="error?.data?.message">{{ error?.data?.message }}</p>
    </div>
    <div v-else>
        <h1>{{ antipixelId }}</h1>
        <p>name: {{ antipixelData?.name }}</p>
        <p>hash: {{ antipixelData?.name }}</p>
        <NuxtImg
            :src="`http://localhost:8333/dev-antipixel/${antipixelData?.path}`"
            placeholder="/favicon.ico"
            class="bento-img"
        />
    </div>
</template>

<script setup lang="ts">
import { z } from "zod";

definePageMeta({
    validate(route) {
        const input: unknown = route.params?.id;
        const id = z.coerce.number().positive().safeParse(route.params?.id);

        if (!id.success) {
            return PageError.badAntipixelId(input);
        }
        return true;
    },
});

const { params } = useRoute();

const antipixelId = ref(z.coerce.number().positive().parse(params?.id));

const { fetchAntipixelById } = useAntipixel();
const {
    data: antipixelData,
    pending,
    error,
} = fetchAntipixelById(antipixelId.value);

</script>
