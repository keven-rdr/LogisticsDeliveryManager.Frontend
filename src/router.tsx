import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CustomerOrders from './pages/customer/Orders';
import OrderDetails from './pages/customer/OrderDetails';
import DriverOrders from './pages/employee/DriverOrders';
import OrderProcess from './pages/employee/OrderProcess';
import MainLayout from './components/layout/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/customer/:customerId/orders',
        element: <CustomerOrders />,
      },
      {
        path: '/customer/:customerId/orders/:id',
        element: <OrderDetails />,
      },
      {
        path: '/employee/:employeeId/orders',
        element: <DriverOrders />,
      },
      {
        path: '/employee/:employeeId/orders/:id',
        element: <OrderProcess />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
