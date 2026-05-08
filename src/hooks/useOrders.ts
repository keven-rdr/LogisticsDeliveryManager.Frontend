import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { OrderStatus } from '@/types/dtos';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id && id !== '',
  });
};

export const useCustomerOrders = (customerId: string) => {
  return useQuery({
    queryKey: ['orders', 'customer', customerId],
    queryFn: () => orderService.getCustomerOrders(customerId),
    enabled: !!customerId && customerId !== '',
  });
};

export const useDriverOrders = (driverId: string) => {
  return useQuery({
    queryKey: ['orders', 'driver', driverId],
    queryFn: () => orderService.getDriverOrders(driverId),
    enabled: !!driverId && driverId !== '',
  });
};

export const useEmployeeOrders = (employeeId: string) => {
  return useQuery({
    queryKey: ['orders', 'employee', employeeId],
    queryFn: () => orderService.getEmployeeOrders(employeeId),
    enabled: !!employeeId && employeeId !== '',
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus | string }) => 
      orderService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
  });
};

export const useEvaluateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating, feedback }: { id: string; rating: number; feedback?: string }) => 
      orderService.evaluateOrder(id, rating, feedback),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
  });
};

export const useUploadProof = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, base64Image }: { id: string; base64Image: string }) => 
      orderService.uploadProof(id, base64Image),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
  });
};
