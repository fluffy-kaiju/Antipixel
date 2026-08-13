<template>
  <div>
    <p v-if="pending">Loading antipixels...</p>

    <p v-else-if="error">Something went wrong fetching data.</p>

    <div v-else class="bento-grid">
      <div
        v-for="(anti, index) in antipixels"
        :key="anti.id"
        class="bento-item"
        :class="getBentoClass(index)"
      >
        <NuxtImg
          :src="`http://localhost:8333/dev-antipixel/${anti.path}`"
          placeholder="./favicon.ico"
          class="bento-img"
        />
        <h3 class="bento-title">{{ anti.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchAntipixels } = useAntipixel()
const { pending, data: antipixels, error } = fetchAntipixels();

// Assigns different grid span classes based on the index
const getBentoClass = (index: number) => {
  const pattern = index % 6;
  switch (pattern) {
    case 0: return 'bento-large'; // Feature item (2x2)
    case 3: return 'bento-wide';  // Wide banner (2x1)
    case 4: return 'bento-tall';  // Vertical card (1x2)
    default: return 'bento-standard'; // Normal tile (1x1)
  }
}
</script>

<style scoped>
/* Grid Container Setup */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: dense; /* Crucial: fills in blank spaces left by tall/wide items */
  gap: 1rem;
  padding: 1rem;
}

/* Base Card Styling */
.bento-item {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background-color: #f3f4f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.bento-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
}

/* Image behavior inside bento cells */
.bento-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Overlay Title */
.bento-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
}

/* Bento Span Variants */
.bento-large {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-wide {
  grid-column: span 2;
  grid-row: span 1;
}

.bento-tall {
  grid-column: span 1;
  grid-row: span 2;
}

.bento-standard {
  grid-column: span 1;
  grid-row: span 1;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 150px;
  }

  /* Prevent spans from forcing horizontal scrolling on small screens */
  .bento-large,
  .bento-wide {
    grid-column: span 2;
  }
}
</style>
