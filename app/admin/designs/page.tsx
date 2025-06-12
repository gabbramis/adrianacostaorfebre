"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Cliente {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface ProductoPedido {
  id: string;
  nombre: string;
  precio: string;
  cantidad: number;
}

interface Pedido {
  id: string;
  fecha: Date;
  cliente: Cliente;
  productos: ProductoPedido[];
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";
  total: number;
}

// Datos de ejemplo
const pedidosIniciales: Pedido[] = [
  {
    id: "PED-001",
    fecha: new Date(2023, 4, 15),
    cliente: {
      nombre: "María González",
      email: "maria@ejemplo.com",
      telefono: "099123456",
      direccion: "Av. 18 de Julio 1234, Montevideo",
    },
    productos: [
      {
        id: "1",
        nombre: "Collar de Plata",
        precio: "1200",
        cantidad: 1,
      },
    ],
    estado: "pendiente",
    total: 1200,
  },
  {
    id: "PED-002",
    fecha: new Date(2023, 4, 16),
    cliente: {
      nombre: "Carlos Rodríguez",
      email: "carlos@ejemplo.com",
      telefono: "098765432",
      direccion: "Bulevar Artigas 567, Montevideo",
    },
    productos: [
      {
        id: "2",
        nombre: "Anillo de Oro",
        precio: "3500",
        cantidad: 1,
      },
      {
        id: "3",
        nombre: "Pulsera de Plata",
        precio: "950",
        cantidad: 2,
      },
    ],
    estado: "procesando",
    total: 5400,
  },
  {
    id: "PED-003",
    fecha: new Date(2023, 4, 17),
    cliente: {
      nombre: "Laura Martínez",
      email: "laura@ejemplo.com",
      telefono: "097654321",
      direccion: "Av. Rivera 890, Montevideo",
    },
    productos: [
      {
        id: "4",
        nombre: "Pendientes de Plata",
        precio: "850",
        cantidad: 1,
      },
    ],
    estado: "enviado",
    total: 850,
  },
];

// Mapeo de estados a colores
const estadoColores = {
  pendiente: "bg-yellow-100 text-yellow-800",
  procesando: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  entregado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);

  const cambiarEstadoPedido = (
    pedidoId: string,
    nuevoEstado: Pedido["estado"]
  ) => {
    setPedidos((pedidosActuales) =>
      pedidosActuales.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <main className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
        <p className="text-gray-500">
          Administra y actualiza el estado de los pedidos
        </p>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableCaption>Lista de pedidos actuales</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell className="font-medium">{pedido.id}</TableCell>
                <TableCell>{formatearFecha(pedido.fecha)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{pedido.cliente.nombre}</div>
                    <div className="text-sm text-gray-500">
                      {pedido.cliente.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pedido.cliente.telefono}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[250px]">
                    {pedido.productos.map((producto) => (
                      <div key={producto.id} className="text-sm mb-1">
                        {producto.cantidad}x {producto.nombre}
                        <span className="text-gray-500 ml-1">
                          (${producto.precio})
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${pedido.total.toLocaleString("es-UY")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={estadoColores[pedido.estado]}
                  >
                    {pedido.estado.charAt(0).toUpperCase() +
                      pedido.estado.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    defaultValue={pedido.estado}
                    onValueChange={(valor) =>
                      cambiarEstadoPedido(pedido.id, valor as Pedido["estado"])
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="procesando">Procesando</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
