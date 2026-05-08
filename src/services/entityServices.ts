import api from './api';
import { CustomerResponse, VehicleResponse, EmployeeResponse, BatchResponse, DriverResponse } from '@/types/dtos';

export const driverService = {
  getAll: async () => {
    const response = await api.get<DriverResponse[]>('/Driver');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<DriverResponse>(`/Driver/${id}`);
    return response.data;
  }
};

export const customerService = {
  getAll: async () => {
    const response = await api.get<CustomerResponse[]>('/Customer');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<CustomerResponse>(`/Customer/${id}`);
    return response.data;
  }
};

export const vehicleService = {
  getAll: async () => {
    const response = await api.get<VehicleResponse[]>('/Vehicle');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<VehicleResponse>(`/Vehicle/${id}`);
    return response.data;
  }
};

export const employeeService = {
  getAll: async () => {
    const response = await api.get<EmployeeResponse[]>('/Employee');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<EmployeeResponse>(`/Employee/${id}`);
    return response.data;
  }
};

export const batchService = {
  getAll: async () => {
    const response = await api.get<BatchResponse[]>('/Batch');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<BatchResponse>(`/Batch/${id}`);
    return response.data;
  }
};
