<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const role = route.query.role;

const title = role === 'admin'
    ? 'Login Colaborador'
    : 'Login Paciente';

function goToRegister() {
    router.push('/register');
}

function goBack() {
    router.push('/');
}
</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <div class="btn-back-container"><button @click="goBack" class="btn-back">Voltar</button></div>

            <div class="login-icon">
                <span class="material-symbols-outlined">calendar_today</span>
            </div>

            <h1 class="login-title">Clínica Médica</h1>
            <p class="login-subtitle">{{ title }}</p>

            <div class="input-group">
                <label>Email</label>
                <input type="email" placeholder="seu@email.com" />
            </div>

            <div class="input-group">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" />
            </div>

            <button class="login-button">Entrar</button>

            <p v-if="role === 'patient'" class="login-link">
                Não tem conta?
                <span @click="goToRegister">Cadastre-se</span>
            </p>

            <div v-if="role === 'patient'" class="test-box">
                <p><strong>Conta de teste:</strong></p>
                <p>Login: leonel@gmail.com</p>
                <p>Senha: 123456</p>
            </div>

            <div v-if="role === 'admin'" class="test-box">
                <p><strong>Conta de administrador:</strong></p>
                <p>Login: secretaria@clinica.com</p>
                <p>Senha: 123456</p>
            </div>

        </div>
    </div>
</template>

<style scoped>
.login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-card {
    width: 360px;
    background: #fff;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    text-align: center;
}

.btn-back-container {
    display: flex;
}

.btn-back {
    background: none;
    border: none;
    padding: 0;
    margin-bottom: 20px;
    font-size: 13px;
    color: #5b4bff;
    cursor: pointer;
}

.btn-back:hover {
    text-decoration: underline;
    color: #4838e6;
}

.login-icon {
    width: 50px;
    height: 50px;
    margin: 0 auto 16px;
    background: #5b4bff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 22px;
}

.login-title {
    font-size: 20px;
    font-weight: 600;
}

.login-subtitle {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
}

.input-group {
    text-align: left;
    margin-bottom: 16px;
}

.input-group label {
    font-size: 13px;
    margin-bottom: 6px;
    display: block;
    color: #444;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    transition: 0.2s;
}

.input-group input:focus {
    border-color: #5b4bff;
    box-shadow: 0 0 0 2px rgba(91, 75, 255, 0.1);
}

button {
    font-weight: 600;
}

.login-button {
    width: 100%;
    padding: 12px;
    background: #5b4bff;
    color: white;
    border-radius: 10px;
    margin-top: 10px;
    transition: 0.2s;
}

.login-button:hover {
    background: #4838e6;
}

.login-link {
    margin-top: 12px;
    font-size: 13px;
}

.login-link span {
    color: #5b4bff;
    cursor: pointer;
    font-weight: 500;
}

.login-link span:hover {
    text-decoration: underline;
}

.test-box {
    margin-top: 16px;
    padding: 10px;
    background: #f5f6fa;
    border-radius: 8px;
    font-size: 12px;
    color: #555;
    text-align: left;
}
</style>