<template>
<div class="flex flex-wrap gap-2">
    <div v-for="(item, index) in objectiveStore.objectives" :key="index" class="border-1 border-round-xl bg-bluegray-300">
        <div class="max-w-25rem">
            {{ item }}
        </div>
    </div>
</div>
    
</template>
<script setup lang="ts">
import { useObjectivesStore } from "../stores/objectivesStore";
import {onBeforeMount } from 'vue'
const objectiveStore = useObjectivesStore();
onBeforeMount(async () => {
  await objectiveStore.getObjectives();
});
</script>
