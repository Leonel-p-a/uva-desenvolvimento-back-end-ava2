<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');

async function handleRegister() {
    try {
        const response = await api('/register', {
            method: 'POST',
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert('Conta criada com sucesso!');

        router.push('/login?role=patient');

    } catch (error: any) {
        alert(error.message);
    }
}

function goBack() {
    router.push('/login?role=patient');
}
</script>

<template>
    <div class="container">
        <div class="card">
            <button @click="goBack" class="btn-back">Voltar</button>

            <h1>Criar Conta</h1>
            <p class="subtitle">Preencha os dados abaixo</p>

            <div class="input-group">
                <label>Nome completo</label>
                <input v-model="name" type="text" placeholder="Seu nome" />
            </div>

            <div class="input-group">
                <label>Email</label>
                <input v-model="email" type="email" placeholder="seu@email.com" />
            </div>

            <div class="input-group">
                <label>Senha</label>
                <input v-model="password" type="password" placeholder="••••••••" />
            </div>

            <button @click="handleRegister" class="btn-create-account">Criar conta</button>

        </div>
    </div>
</template>

<style scoped>
.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    width: 360px;
    background: #fff;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h1 {
    text-align: center;
}

.subtitle {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
}

.input-group {
    margin-bottom: 16px;
}

.input-group label {
    font-size: 13px;
    display: block;
    margin-bottom: 6px;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

button {
    padding: 12px;
    border-radius: 10px;
    font-weight: 600;
    transition: 0.2s;
}

.btn-back {
    background: none;
    border: none;
    padding: 0;
    margin-bottom: 20px;
    font-size: 13px;
    color: #5b4bff;
    cursor: pointer;
    text-align: left;
}

.btn-back:hover {
    text-decoration: underline;
    color: #4838e6;
}

.btn-create-account {
    width: 100%;
    background: #5b4bff;
    color: white;
}

.btn-create-account:hover {
    background-color: #311eff;
}
</style>