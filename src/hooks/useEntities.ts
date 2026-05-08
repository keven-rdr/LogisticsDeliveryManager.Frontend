import { useQuery } from '@tanstack/react-query';
import { customerService, vehicleService, employeeService } from '@/services/entityServices';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAll(),
  });
};

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getAll(),
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll(),
  });
};
