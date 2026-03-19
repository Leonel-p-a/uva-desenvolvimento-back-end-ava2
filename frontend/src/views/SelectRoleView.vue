<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToLogin(role: string) {
    router.push(`/login?role=${role}`);
}
</script>

<template>
    <div class="container">
        <div class="card">
            <h1>Bem-vindo à Clínica</h1>
            <p>Escolha como deseja entrar:</p>

            <div class="buttons">
                <button @click="goToLogin('patient')" class="btn primary">
                    Sou Associado
                </button>

                <button @click="goToLogin('admin')" class="btn secondary">
                    Sou Colaborador
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eef1f6;
}

h1 {
    font-size: 2.2rem;
}

p {
    font-size: 1.6rem;
}

.card {
    background: white;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
    width: 320px;
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn {
    padding: 12px;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.primary {
    background: #5b4bff;

    &:hover {
        background-color: #311eff;
    }
}

.secondary {
    background: #333;

    &:hover {
        background-color: #e9e9e9;
        color: #333;
    }
}
</style>