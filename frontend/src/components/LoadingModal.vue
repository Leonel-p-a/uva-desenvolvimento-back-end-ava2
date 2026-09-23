<script setup lang="ts">
import { useLoading } from '../composables/useLoading';
const { isLoading, message } = useLoading();
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isLoading" class="loading-overlay" role="alert" aria-busy="true">
                <div class="loading-modal">
                    <div class="spinner"></div>
                    <p>{{ message }}</p>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    pointer-events: all;
}

.loading-modal {
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    min-width: 220px;
}

.spinner {
    width: 36px;
    height: 36px;
    border: 4px solid #e0e0e0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>