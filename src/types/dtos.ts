export enum CargoType {
  General = 0,
  Fragile = 1,
  Refrigerated = 2,
  Hazardous = 3
}

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  InTransit = 3,
  Delivered = 4,
  Cancelled = 5
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderResponse {
  id: string;
  status: string;
  customerId: string;
  destinationAddress: Address;
  cargoType: string;
  weight: number;
  volume: number;
  isPriority: boolean;
  assignedVehicleId?: string;
  rating?: number;
  feedback?: string;
}

export interface CustomerResponse {
  id: string;
  name: string;
  document: string;
  email: string;
  phoneNumber: string;
}

export interface DriverResponse {
  id: string;
  employeeId: string;
  licenseTypes: number[];
}

export interface VehicleResponse {
  id: string;
  licensePlate: string;
  model: string;
  weightCapacity: number;
  volumeCapacity: number;
  compartmentType: number;
  currentDriverId?: string;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  document: string;
  email: string;
  roleType: number;
}

export interface BatchResponse {
  id: string;
  type: string;
  driver: DriverResponse;
  vehicle: VehicleResponse;
  deliveryDate: string;
  orders: OrderResponse[];
  createdAt: string;
}

