import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomers, useEmployees } from "@/hooks/useEntities";
import { useOrders } from "@/hooks/useOrders";
import { CustomerResponse, EmployeeResponse, OrderResponse } from "@/types/dtos";
import { Briefcase, Loader2, Package, Truck, Users } from "lucide-react";

const statusMap: Record<string, { label: string; badge: BadgeProps }> = {
  Pending: { label: "Pendente", badge: { variant: "soft", color: "neutral" } },
  Processing: { label: "Processando", badge: { variant: "soft", color: "warning" } },
  Shipped: { label: "Enviado", badge: { variant: "soft", color: "info" } },
  InTransit: { label: "Em rota", badge: { variant: "soft", color: "violet" } },
  Delivered: { label: "Entregue", badge: { variant: "soft", color: "success" } },
  Cancelled: { label: "Cancelado", badge: { variant: "soft", color: "error" } },
};

const cargoTypeMap: Record<string, string> = {
  General: "Geral",
  Fragile: "Frágil",
  Refrigerated: "Refrigerada",
  Hazardous: "Perigosa",
};

const roleTypeMap: Record<string | number, string> = {
  Manager: "Gerente",
  Driver: "Motorista",
  TruckLoader: "Operador de Carga",
  0: "Gerente",
  1: "Motorista",
  2: "Operador de Carga",
};

function formatAddress(order: OrderResponse) {
  const address = order.destinationAddress;

  if (!address) {
    return "Endereco nao informado";
  }

  return [address.street, address.city, address.state].filter(Boolean).join(", ");
}

function StatusBadge({ status }: { status: string }) {
  const statusInfo = statusMap[status] ?? {
    label: status || "Sem status",
    badge: { variant: "soft", color: "neutral" } satisfies BadgeProps,
  };

  return <Badge {...statusInfo.badge}>{statusInfo.label}</Badge>;
}

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );
}

function SectionCard({
  title,
  count,
  icon: Icon,
  children,
}: {
  title: string;
  count: number;
  icon: typeof Users;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <Badge variant="soft" color="neutral">
          {count}
        </Badge>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CustomersTable({ customers }: { customers: CustomerResponse[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 ? (
          <EmptyRow colSpan={5} message="Nenhum cliente encontrado." />
        ) : (
          customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">#{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.document}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phoneNumber}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function OrdersTable({ orders }: { orders: OrderResponse[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Carga</TableHead>
          <TableHead>Peso</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead>Destino</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <EmptyRow colSpan={7} message="Nenhum pedido encontrado." />
        ) : (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>#{order.customerId}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell>{cargoTypeMap[order.cargoType] ?? "Nao informado"}</TableCell>
              <TableCell>{order.weight} kg</TableCell>
              <TableCell>{order.isPriority ? "Sim" : "Nao"}</TableCell>
              <TableCell>{formatAddress(order)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function EmployeesTable({ employees }: { employees: EmployeeResponse[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Cargo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.length === 0 ? (
          <EmptyRow colSpan={5} message="Nenhum empregado encontrado." />
        ) : (
          employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">#{employee.id}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.document}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{roleTypeMap[employee.roleType] ?? "Nao informado"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function DeliveriesTable({ deliveries }: { deliveries: OrderResponse[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Entrega</TableHead>
          <TableHead>Pedido</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Veiculo</TableHead>
          <TableHead>Destino</TableHead>
          <TableHead>Avaliacao</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deliveries.length === 0 ? (
          <EmptyRow colSpan={6} message="Nenhuma entrega encontrada." />
        ) : (
          deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-medium">#{delivery.id}</TableCell>
              <TableCell>#{delivery.id}</TableCell>
              <TableCell>
                <StatusBadge status={delivery.status} />
              </TableCell>
              <TableCell>
                {delivery.assignedVehicleId ? `#${delivery.assignedVehicleId}` : "Nao atribuido"}
              </TableCell>
              <TableCell>{formatAddress(delivery)}</TableCell>
              <TableCell>{delivery.rating ? `${delivery.rating}/5` : "Sem avaliacao"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default function ListagemGeral() {
  const { data: customers = [], isLoading: customersLoading } = useCustomers();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();

  const isLoading = customersLoading || ordersLoading || employeesLoading;
  const deliveries = orders.filter((order) =>
    ["Shipped", "InTransit", "Delivered"].includes(order.status),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Listagem Geral</h1>
        <p className="text-muted-foreground">
          Consulta consolidada de clientes, pedidos, empregados e entregas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empregados</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas</CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveries.length}</div>
          </CardContent>
        </Card>
      </div>

      <SectionCard title="Clientes" count={customers.length} icon={Users}>
        <CustomersTable customers={customers} />
      </SectionCard>

      <SectionCard title="Pedidos" count={orders.length} icon={Package}>
        <OrdersTable orders={orders} />
      </SectionCard>

      <SectionCard title="Empregados" count={employees.length} icon={Briefcase}>
        <EmployeesTable employees={employees} />
      </SectionCard>

      <SectionCard title="Entregas" count={deliveries.length} icon={Truck}>
        <DeliveriesTable deliveries={deliveries} />
      </SectionCard>
    </div>
  );
}
