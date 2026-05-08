import api from './api';
import { OrderResponse, OrderStatus } from '@/types/dtos';

export const orderService = {
  getAll: async () => {
    const response = await api.get<OrderResponse[]>('/Order');
    return response.data;
  },

  getCustomerOrders: async (customerId: string) => {
    const response = await api.get<OrderResponse[]>(`/Order/customer/${customerId}`);
    return response.data;
  },

  getDriverOrders: async (driverId: string) => {
    const response = await api.get<OrderResponse[]>(`/Order/driver/${driverId}`);
    return response.data;
  },

  getEmployeeOrders: async (employeeId: string) => {
    const response = await api.get<OrderResponse[]>(`/Order/employee/${employeeId}`);
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get<OrderResponse>(`/Order/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: OrderStatus | string) => {
    await api.patch(`/Order/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  uploadProof: async (id: string, base64Image: string) => {
    await api.post(`/Order/${id}/proof`, `"${base64Image}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  evaluateOrder: async (id: string, rating: number, feedback?: string) => {
    await api.post(`/Order/${id}/evaluate`, { rating, feedback });
  }
};
