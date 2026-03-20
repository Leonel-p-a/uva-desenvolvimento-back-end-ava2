<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
import type { Appointment } from '../types/Appointment';
import type { Doctor } from '../types/Doctor';
import type { AppointmentStatus } from '../types/Appointment';

const router = useRouter();

// mapear traducao de status
const statusMap: Record<AppointmentStatus, string> = {
    scheduled: "Agendada",
    completed: "Realizada",
    cancelled: "Cancelada"
};

// estados
const appointments = ref<Appointment[]>([]);
const upcoming = ref<Appointment[]>([]);
const history = ref<Appointment[]>([]);
const doctors = ref<Doctor[]>([]);
const errorMessage = ref('');
const userName = ref('');
const weather = ref<any>(null);
const weatherError = ref('');

// modal
const showModal = ref(false);
const date = ref('');
const doctorId = ref('');

// exibir usuário
async function fetchUser() {
    try {
        const response = await api('/me');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        userName.value = data.name;

    } catch (error: any) {
        console.error('Erro ao buscar usuário:', error);
    }
}

// separar consultas
function splitAppointments(data: Appointment[]) {
    const now = new Date();

    upcoming.value = data.filter(a =>
        new Date(a.date) >= now && a.status === 'scheduled'
    );

    history.value = data.filter(a =>
        new Date(a.date) < now || a.status !== 'scheduled'
    );
}

// buscar consultas
async function fetchAppointments() {
    const response = await api('/appointments');
    const data = await response.json();

    appointments.value = data;
    splitAppointments(data);
}

// criar consulta
async function createAppointment() {
    try {
        await api('/appointments', {
            method: 'POST',
            body: JSON.stringify({
                doctorId: doctorId.value,
                date: date.value
            })
        });

        closeModal();
        fetchAppointments();

    } catch (error: any) {
        alert(error.message);
    }
}

// cancelar
async function cancelAppointment(id: string) {
    await api(`/appointments/${id}`, {
        method: 'DELETE'
    });

    fetchAppointments();
}

// concluir
async function completeAppointment(id: string) {
    await api(`/appointments/${id}/complete`, {
        method: 'PATCH'
    });

    fetchAppointments();
}

// buscar médicos
async function fetchDoctors() {
    try {
        errorMessage.value = '';

        const response = await api('/doctors');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar médicos');
        }

        doctors.value = data;

    } catch (error: any) {
        errorMessage.value = error.message || 'Erro inesperado ao carregar médicos';
    }
}

// modal
function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    date.value = '';
    doctorId.value = '';
}

// logout
function logout() {
    localStorage.removeItem('token');
    router.push('/login?role=patient');
}

function getLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                });
            },
            () => reject("Permissão de localização negada")
        );
    });
}

async function fetchWeather() {
    try {
        const { lat, lon } = await getLocation();

        const response = await api(`/weather/coords?lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar clima");
        }

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

function translateStatus(status: AppointmentStatus) {
    return statusMap[status];
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
                    <h1>Minhas Consultas</h1>
                    <p class="user-greetings">Olá, {{ userName || 'Paciente' }}</p>
                </div>
            </div>

            <button class="logout" @click="logout">Sair</button>
        </div>

        <div v-if="weather" class="weather-card">
            <h3>📍 {{ weather.city }}</h3>
            <p>🌡️ {{ weather.temperature }}°C</p>
            <p>{{ getWeatherIcon(weather.description) }} {{ weather.description }}</p>
        </div>

        <div v-else-if="weatherError">
            <p>{{ weatherError }}</p>
        </div>

        <!-- NOVA CONSULTA -->
        <button class="new-btn" @click="openModal">
            + Nova Consulta
        </button>

        <!-- PRÓXIMAS -->
        <h2>Próximas Consultas</h2>

        <div v-if="upcoming.length === 0" class="empty">
            Nenhuma consulta agendada
        </div>

        <div v-for="appt in upcoming" :key="appt._id" class="card upcoming">
            <div class="card-top">
                <div>
                    <h3>Dr(a). {{ appt.doctor.name }}</h3>
                    <p class="specialty">{{ appt.doctor.specialty }}</p>
                </div>

                <span class="badge">{{ translateStatus(appt.status) }}</span>
            </div>

            <div>
                <p>{{ new Date(appt.date).toLocaleDateString() }}</p>
                <p>{{ new Date(appt.date).toLocaleTimeString() }}</p>
            </div>

            <div class="actions">
                <button class="cancel" @click="cancelAppointment(appt._id)">
                    Cancelar
                </button>

                <button class="complete" @click="completeAppointment(appt._id)">
                    Concluir
                </button>
            </div>
        </div>

        <!-- HISTÓRICO -->
        <h2 class="history-title">Histórico</h2>

        <div v-if="history.length === 0" class="empty">
            Nenhum histórico
        </div>

        <div v-for="appt in history" :key="appt._id" class="card history">
            <div class="history-content">
                <div class="person-icon">
                    <span class="material-symbols-outlined">person</span>
                </div>
                <div>
                    <strong>{{ appt.doctor.name }}</strong>
                    <p class="specialty">{{ appt.doctor.specialty }}</p>
                </div>
            </div>

            <div class="date">
                {{ new Date(appt.date).toLocaleDateString() }}
                {{ new Date(appt.date).toLocaleTimeString() }}
            </div>
        </div>

        <!-- MODAL -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <h2>Nova Consulta</h2>

                <div class="input-group">
                    <label>Médico</label>
                    <select v-model="doctorId">
                        <option disabled value="">Selecione</option>
                        <option v-for="doc in doctors" :key="doc._id" :value="doc._id">
                            {{ doc.name }} - {{ doc.specialty }}
                        </option>
                    </select>
                    <p v-if="errorMessage" class="error">
                        {{ errorMessage }}
                    </p>
                </div>

                <div class="input-group">
                    <label>Data e hora</label>
                    <input type="datetime-local" v-model="date" />
                </div>

                <div class="modal-actions">
                    <button class="save" @click="createAppointment">
                        Salvar
                    </button>

                    <button class="cancel" @click="closeModal">
                        Cancelar
                    </button>
                </div>
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

/* HEADER */
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

/* BOTÃO */
.new-btn {
    margin: 20px 0;
    background: #5b4bff;
    color: white;
    padding: 12px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
}

/* CARD */
.card {
    background: white;
    padding: 16px;
    border-radius: 12px;
    margin-top: 10px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.100);
}

.upcoming {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-left: 3px solid #5b4bff;
    max-width: 650px;
}

.card-top {
    display: flex;
    justify-content: space-between;
}

.specialty {
    color: #777;
    font-size: 14px;
}

/* BADGE */
.badge {
    background: #d1fae5;
    color: #065f46;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* ACTIONS */
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
}

.complete {
    background: #dbeafe;
    color: #1e40af;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
}

/* HISTÓRICO */
.history-title {
    margin-top: 2rem;
}

.history {
    display: flex;
    justify-content: space-between;
}

.history-content {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.person-icon {
    width: 50px;
    height: 50px;
    border: 3px solid #5b4bff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5b4bff;
    font-size: 22px;
}

.material-symbols-outlined {
    font-size: 30px;
}

.date {
    font-size: 14px;
    color: #666;
}

/* EMPTY */
.empty {
    color: #777;
    margin-top: 10px;
}

/* MODAL */
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
}
</style>