<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
import type { Appointment } from '../types/Appointment';
import type { Doctor } from '../types/Doctor';

const router = useRouter();

// estados
const appointments = ref<Appointment[]>([]);
const upcoming = ref<Appointment[]>([]);
const history = ref<Appointment[]>([]);
const doctors = ref<Doctor[]>([]);
const errorMessage = ref('');
const userName = ref('');

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

onMounted(() => {
    fetchAppointments();
    fetchDoctors();
    fetchUser();
});
</script>

<template>
    <div class="container">

        <!-- HEADER -->
        <div class="header">
            <div>
                <h1>Minhas Consultas</h1>
                <p>Olá, {{ userName || 'Paciente' }}</p>
            </div>

            <button class="logout" @click="logout">Sair</button>
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
                    <h3>{{ appt.doctor.name }}</h3>
                    <p class="specialty">{{ appt.doctor.specialty }}</p>
                </div>

                <span class="badge">Agendada</span>
            </div>

            <p>{{ new Date(appt.date).toLocaleDateString() }}</p>
            <p>{{ new Date(appt.date).toLocaleTimeString() }}</p>

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
        <h2>Histórico</h2>

        <div v-if="history.length === 0" class="empty">
            Nenhum histórico
        </div>

        <div v-for="appt in history" :key="appt._id" class="card history">
            <div>
                <strong>{{ appt.doctor.name }}</strong>
                <p class="specialty">{{ appt.doctor.specialty }}</p>
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
}

/* HEADER */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
.history {
    display: flex;
    justify-content: space-between;
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