<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
import type { Appointment } from '../types/Appointment';
import type { Doctor } from '../types/Doctor';
import type { AppointmentStatus } from '../types/Appointment';

const router = useRouter();

// mapear tradução de status
const statusMap: Record<AppointmentStatus, string> = {
    scheduled: "Agendada",
    completed: "Realizada",
    cancelled: "Cancelada"
};

// estados
const appointments = ref<Appointment[]>([]);
const filteredAppointments = ref<Appointment[]>([]);
const doctors = ref<Doctor[]>([]);
const errorMessage = ref('');
const userName = ref('');
const weather = ref<any>(null);
const weatherError = ref('');

// filtros
const filterStatus = ref<'all' | AppointmentStatus>('all');
const searchQuery = ref('');

// exibir usuário
async function fetchUser() {
    try {
        const response = await api('/me');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        userName.value = data.name;
    } catch (error: any) {
        console.error('Erro ao buscar usuário:', error);
    }
}

// buscar consultas
async function fetchAppointments() {
    try {
        const response = await api('/appointments/all');
        const data = await response.json();
        appointments.value = data;
        applyFilters();
    } catch (error: any) {
        console.error('Erro ao buscar consultas:', error);
    }
}

// aplicar filtros
function applyFilters() {
    let temp = [...appointments.value];

    // filtro por status
    if (filterStatus.value !== 'all') {
        temp = temp.filter(a => a.status === filterStatus.value);
    }

    // filtro por pesquisa
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        temp = temp.filter(a =>
            a.patient.name.toLowerCase().includes(q) ||
            a.doctor.name.toLowerCase().includes(q)
        );
    }

    filteredAppointments.value = temp;
}

// alterar status da consulta (somente admin)
async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    try {
        if (status === 'completed') {
            await api(`/appointments/${id}/complete`, { method: 'PATCH' })
        } else if (status === 'cancelled') {
            await api(`/appointments/${id}/cancel`, { method: 'DELETE' })
        }
        fetchAppointments();
    } catch (error: any) {
        alert(error.message);
    }
}

// buscar médicos
async function fetchDoctors() {
    try {
        errorMessage.value = '';
        const response = await api('/doctors');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro ao buscar médicos');
        doctors.value = data;
    } catch (error: any) {
        errorMessage.value = error.message || 'Erro inesperado ao carregar médicos';
    }
}

// logout
function logout() {
    localStorage.removeItem('token');
    router.push('/login?role=admin');
}

// localização e clima
function getLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => reject("Permissão de localização negada")
        );
    });
}

async function fetchWeather() {
    try {
        const { lat, lon } = await getLocation();
        const response = await api(`/weather/coords?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro ao buscar clima");
        weather.value = data;
    } catch (error: any) {
        weatherError.value = error;
    }
}

function getWeatherIcon(description: string) {
    if (description.includes("chuva")) return "🌧️";
    if (description.includes("nublado")) return "☁️";
    if (description.includes("céu limpo")) return "☀️";
    return "🌤️";
}

// traduz status
function translateStatus(status: AppointmentStatus) {
    return statusMap[status];
}

// métricas
const totalAppointments = computed(() => appointments.value.length);
const totalScheduled = computed(() => appointments.value.filter(a => a.status === 'scheduled').length);
const totalCompleted = computed(() => appointments.value.filter(a => a.status === 'completed').length);
const totalCancelled = computed(() => appointments.value.filter(a => a.status === 'cancelled').length);

// aplicar filtro automaticamente ao mudar inputs
watch([filterStatus, searchQuery], applyFilters);

function badgeColor(status: AppointmentStatus) {
    switch (status) {
        case 'scheduled':
            return '#a7f3d0'; // verde
        case 'completed':
            return '#93c5fd'; // azul
        case 'cancelled':
            return '#fecaca'; // vermelho
        default:
            return '#d1fae5'; // fallback
    }
}

onMounted(() => {
    fetchAppointments();
    fetchDoctors();
    fetchUser();
    fetchWeather();
});
</script>

<template>
    <div class="container">

        <!-- HEADER -->
        <div class="header">
            <div class="header-title-container">
                <div class="calendar-icon">
                    <span class="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                    <h1>Dashboard Admin</h1>
                    <p class="user-greetings">Olá, {{ userName || 'Admin' }}</p>
                </div>
            </div>
            <button class="logout" @click="logout">Sair</button>
        </div>

        <!-- WEATHER -->
        <div v-if="weather" class="weather-card">
            <h3>📍 {{ weather.city }}</h3>
            <p>🌡️ {{ weather.temperature }}°C</p>
            <p>{{ getWeatherIcon(weather.description) }} {{ weather.description }}</p>
        </div>
        <div v-else-if="weatherError">
            <p>{{ weatherError }}</p>
        </div>

        <!-- DASHBOARD MÉTRICAS -->
        <div class="metrics">
            <div class="metric-card">
                <h3>Total Consultas</h3>
                <p>{{ totalAppointments }}</p>
            </div>
            <div class="metric-card">
                <h3>Agendadas</h3>
                <p>{{ totalScheduled }}</p>
            </div>
            <div class="metric-card">
                <h3>Concluídas</h3>
                <p>{{ totalCompleted }}</p>
            </div>
            <div class="metric-card">
                <h3>Canceladas</h3>
                <p>{{ totalCancelled }}</p>
            </div>
        </div>

        <!-- FILTROS -->
        <div class="filters">
            <select v-model="filterStatus">
                <option value="all">Todas</option>
                <option value="scheduled">Agendadas</option>
                <option value="completed">Concluídas</option>
                <option value="cancelled">Canceladas</option>
            </select>

            <input type="text" placeholder="Pesquisar paciente ou doutor" v-model="searchQuery" />
        </div>

        <!-- LISTA DE CONSULTAS -->
        <div>
            <h2>Consultas</h2>
        </div>
        <div v-if="filteredAppointments.length === 0" class="empty">
            Nenhuma consulta encontrada
        </div>

        <div v-for="appt in filteredAppointments" :key="appt._id" class="card upcoming">
            <div class="card-top">
                <div>
                    <h3>Dr(a). {{ appt.doctor.name }}</h3>
                    <p class="specialty">{{ appt.doctor.specialty }}</p>
                    <p><strong>Paciente:</strong> {{ appt.patient.name }}</p>
                </div>

                <span :style="{ backgroundColor: badgeColor(appt.status), color: '#000' }" class="badge">
                    {{ translateStatus(appt.status) }}
                </span>
            </div>

            <div>
                <p>{{ new Date(appt.date).toLocaleDateString() }}</p>
                <p>{{ new Date(appt.date).toLocaleTimeString() }}</p>
            </div>

            <!-- AÇÕES ADMIN -->
            <div v-if="appt.status === 'scheduled'" class="actions">
                <button class="complete" @click="updateAppointmentStatus(appt._id, 'completed')">
                    Concluir
                </button>
                <button class="cancel" @click="updateAppointmentStatus(appt._id, 'cancelled')">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 24px;
    background: #f5f6fa;
    min-height: 100vh;
    font-size: 1.6rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title-container {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.calendar-icon {
    width: 50px;
    height: 50px;
    background: #5b4bff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 22px;
}

h1 {
    font-size: 2.5rem;
}

.user-greetings {
    font-size: 1.6rem;
}

.weather-card {
    background: white;
    padding: 16px;
    border-radius: 12px;
    margin-top: 20px;
}

.logout {
    background: none;
    border: none;
    cursor: pointer;
    color: #555;
}

.new-btn {
    margin: 20px 0;
    background: #5b4bff;
    color: white;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
}

.metrics {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.metric-card {
    background: white;
    padding: 16px;
    border-radius: 12px;
    flex: 1;
    text-align: center;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
}

.filters {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.filters input,
.filters select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
    flex: 1;
}

.card {
    background: white;
    padding: 16px;
    border-radius: 12px;
    margin-top: 10px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
}

.card-top {
    display: flex;
    justify-content: space-between;
}

.specialty {
    color: #777;
    font-size: 14px;
}

.badge {
    padding: 0 15px;
    border-radius: 9999px;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    min-width: fit-content;
    white-space: nowrap;
}

.actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
}

.cancel {
    background: #fee2e2;
    color: #991b1b;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
}

.complete {
    background: #dbeafe;
    color: #1e40af;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    background: white;
    padding: 24px;
    border-radius: 12px;
    width: 300px;
}

.input-group {
    margin-bottom: 12px;
}

.error {
    color: #b91c1c;
    font-size: 14px;
    margin-bottom: 10px;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
}

.save {
    background: #5b4bff;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.empty {
    color: #777;
    margin-top: 10px;
}
</style>