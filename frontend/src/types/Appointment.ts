export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Doctor {
  name: string;
  specialty: string;
}

export interface Appointment {
  _id: string;
  date: string;
  status: AppointmentStatus;
  doctor: Doctor;
}