import { createRouter, createWebHistory } from 'vue-router';

import SelectRoleView from '../views/SelectRoleView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardPatient from '../views/DashboardPatient.vue';
import DashboardAdmin from '../views/DashboardAdmin.vue';
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
    path: '/patient',
    component: DashboardPatient
  },
  {
    path: '/admin',
    component: DashboardAdmin
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});