"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  Clock,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const orders = [
    {
      id: "PED-001",
      customer: {
        name: "María González",
        email: "maria@email.com",
        phone: "+598 99 123 456",
      },
      items: [
        { name: "Anillo de Oro Rosa", quantity: 1, price: 850 },
        { name: "Collar de Perlas", quantity: 1, price: 400 },
      ],
      total: 1250,
      status: "pending",
      date: "2024-01-15",
      address: "Av. 18 de Julio 1234, Montevideo",
      paymentMethod: "Tarjeta de Crédito",
      notes: "Entrega urgente para regalo de cumpleaños",
    },
    {
      id: "PED-002",
      customer: {
        name: "Carlos Rodríguez",
        email: "carlos@email.com",
        phone: "+598 99 654 321",
      },
      items: [{ name: "Reloj de Plata", quantity: 1, price: 890 }],
      total: 890,
      status: "processing",
      date: "2024-01-15",
      address: "Bvar. Artigas 567, Montevideo",
      paymentMethod: "Transferencia Bancaria",
      notes: "",
    },
    {
      id: "PED-003",
      customer: {
        name: "Ana Martínez",
        email: "ana@email.com",
        phone: "+598 99 789 123",
      },
      items: [
        { name: "Aretes de Diamante", quantity: 1, price: 1200 },
        { name: "Pulsera de Oro", quantity: 1, price: 650 },
        { name: "Anillo Compromiso", quantity: 1, price: 2500 },
      ],
      total: 4350,
      status: "shipped",
      date: "2024-01-14",
      address: "Pocitos, Montevideo",
      paymentMethod: "Efectivo",
      notes: "Cliente prefiere entrega en horario de tarde",
    },
    {
      id: "PED-004",
      customer: {
        name: "Luis Fernández",
        email: "luis@email.com",
        phone: "+598 99 456 789",
      },
      items: [{ name: "Cadena de Plata", quantity: 1, price: 650 }],
      total: 650,
      status: "delivered",
      date: "2024-01-14",
      address: "Ciudad Vieja, Montevideo",
      paymentMethod: "Tarjeta de Débito",
      notes: "",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Pendiente",
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      },
      processing: {
        label: "Procesando",
        variant: "default" as const,
        color: "bg-blue-100 text-blue-800",
      },
      shipped: {
        label: "Enviado",
        variant: "outline" as const,
        color: "bg-purple-100 text-purple-800",
      },
      delivered: {
        label: "Entregado",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const OrderDetailDialog = ({ order }: { order: (typeof orders)[0] }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Pedido {order.id}</DialogTitle>
          <DialogDescription>Información completa del pedido</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={getStatusBadge(order.status).color}>
              {getStatusBadge(order.status).label}
            </Badge>
            <div className="flex gap-2">
              <Select defaultValue={order.status}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm">Actualizar</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.customer.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {order.customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {order.customer.phone}
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  {order.address}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Información del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span className="text-gray-600">Fecha:</span>
                  <span>{order.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Método de Pago:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">${order.total}</span>
                </div>
                {order.notes && (
                  <div className="text-sm">
                    <span className="text-gray-600">Notas:</span>
                    <p className="mt-1 text-gray-800">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${item.price}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t font-semibold">
                  <span>Total:</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600 mt-2">
          Administra todos los pedidos de tu tienda
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">
            Pendientes ({statusCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Procesando ({statusCounts.processing})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Enviados ({statusCounts.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Entregados ({statusCounts.delivered})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedStatus === "all"
                  ? "Todos los Pedidos"
                  : selectedStatus === "pending"
                  ? "Pedidos Pendientes"
                  : selectedStatus === "processing"
                  ? "Pedidos en Proceso"
                  : selectedStatus === "shipped"
                  ? "Pedidos Enviados"
                  : "Pedidos Entregados"}
              </CardTitle>
              <CardDescription>
                {filteredOrders.length} pedidos encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-gray-600">
                              {order.customer.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} productos</TableCell>
                        <TableCell className="font-semibold">
                          ${order.total}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              getStatusBadge(order.status).color
                            } flex items-center gap-1 w-fit`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {getStatusBadge(order.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <OrderDetailDialog order={order} />
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
