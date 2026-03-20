import { createRouter, createWebHistory } from 'vue-router';

import SelectRoleView from '../views/SelectRoleView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardPatientView from '../views/DashboardPatientView.vue';
import DashboardAdminView from '../views/DashboardAdminView.vue';
import CreateAccountView from '../views/CreateAccountView.vue';

const routes = [
  {
    path: '/',
    component: SelectRoleView
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/register',
    component: CreateAccountView
  },
  {
    path: '/dashboard-patient',
    component: DashboardPatientView
  },
  {
    path: '/dashboard-admin',
    component: DashboardAdminView
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});