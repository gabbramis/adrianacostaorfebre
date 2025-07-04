//admin/orders
//import { createSupabaseServer } from "@/utils/supabase/server";
//import { redirect } from "next/navigation";
//import DetallesDeOrdenes from "@/components/admin/DetallesDeOrdenes";

//export default async function OrderPage() {
// const supabase = await createSupabaseServer();

// CHECKEAR QUE EL USER EXISTA
//const {
//  data: { user },
//} = await supabase.auth.getUser();
//if (!user) {
//  redirect("/auth");
//}

// TRAER ORDERS
//const { data: orders } = await supabase.from("orders").select("*");

//return <DetallesDeOrdenes orders={orders || []} />;
//}
// types/orders.ts

// pages/admin/orders.tsx
// types/orders.ts

// pages/admin/orders.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { OrderWithDetails, OrderStatus } from "../types/orders";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const statusConfig = {
  pendiente: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  pagado: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  enviado: { color: "bg-blue-100 text-blue-800", icon: Package },
  entregado: { color: "bg-purple-100 text-purple-800", icon: CheckCircle },
  cancelado: { color: "bg-red-100 text-red-800", icon: AlertCircle },
};

const paymentMethodConfig = {
  mercadopago: { label: "Mercado Pago", color: "bg-blue-100 text-blue-800" },
  transfer: {
    label: "Transferencia",
    color: "bg-orange-100 text-orange-800",
  },
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [paymentFilter, setPaymentFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");

  console.log(setExpandedOrder);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching orders...");

      // Primero probamos una consulta simple
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Orders data:", ordersData);
      console.log("Orders error:", ordersError);

      if (ordersError) {
        console.error("Orders error:", ordersError);
        throw ordersError;
      }

      if (!ordersData || ordersData.length === 0) {
        console.log("No orders found");
        setOrders([]);
        return;
      }

      // Luego cargamos los datos relacionados
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          // Cargar cliente
          const { data: clientData, error: clientError } = await supabase
            .from("clients")
            .select("*")
            .eq("id", order.client_id)
            .single();

          if (clientError) {
            console.error("Client error for order", order.id, ":", clientError);
          }

          // Cargar items
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id);

          if (itemsError) {
            console.error("Items error for order", order.id, ":", itemsError);
          }

          return {
            ...order,
            client: clientData || {
              id: "unknown",
              first_name: "Cliente",
              last_name: "Desconocido",
              email: "N/A",
              phone: null,
              address: null,
              city: null,
              postal_code: null,
              notes: null,
              created_at: new Date().toISOString(),
            },
            order_items: itemsData || [],
          };
        })
      );

      console.log("Orders with details loaded:", ordersWithDetails);
      setOrders(ordersWithDetails);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(`Error al cargar las órdenes: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === "pagado" && {
            approved_at: new Date().toISOString(),
          }),
        })
        .eq("id", orderId);

      if (error) throw error;

      // Actualizar el estado local
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Error al actualizar el estado de la orden");
    }
  };

  const addFollowUpNote = async (orderId: string) => {
    if (!followUpNote.trim()) return;

    try {
      const currentOrder = orders.find((o) => o.id === orderId);
      const existingNotes = currentOrder?.notes || "";
      const newNote = `[${new Date().toLocaleString()}] Follow-up: ${followUpNote}`;
      const updatedNotes = existingNotes
        ? `${existingNotes}\n${newNote}`
        : newNote;

      const { error } = await supabase
        .from("orders")
        .update({ notes: updatedNotes })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, notes: updatedNotes } : order
        )
      );

      setFollowUpNote("");
    } catch (err) {
      console.error("Error adding follow-up note:", err);
      alert("Error al agregar nota de seguimiento");
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Verificar que el cliente existe
    if (!order.client) return false;

    const matchesStatus =
      statusFilter === "todos" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "todos" || order.payment_method === paymentFilter;
    const matchesSearch =
      searchTerm === "" ||
      (order.client.first_name &&
        order.client.first_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (order.client.last_name &&
        order.client.last_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (order.client.email &&
        order.client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPayment && matchesSearch;
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
    }).format(amount);
  };

  const getOrderTotal = (order: OrderWithDetails) => {
    const itemsTotal = order.total_amount;
    const shippingCost = order.shipping_cost || 0;
    return itemsTotal + shippingCost;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Órdenes</h1>
        <Button onClick={fetchOrders} variant="outline">
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Cliente, email o ID de orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Pago</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los métodos</SelectItem>
                  <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Órdenes ({filteredOrders.length})
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-gray-500">No se encontraron órdenes</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-left">
                          <CardTitle className="text-lg">
                            {order.client?.first_name || "Cliente"}{" "}
                            {order.client?.last_name || "Desconocido"}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Orden #{order.id.slice(-8)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge
                          className={
                            statusConfig[order.status as OrderStatus]?.color
                          }
                        >
                          {order.status}
                        </Badge>

                        <Badge
                          variant="outline"
                          className={
                            paymentMethodConfig[order.payment_method]?.color
                          }
                        >
                          {paymentMethodConfig[order.payment_method]?.label}
                        </Badge>

                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(getOrderTotal(order))}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-6">
                    {/* Información del cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Información del Cliente
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{order.client?.email || "N/A"}</span>
                          </div>
                          {order.client?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{order.client.phone}</span>
                            </div>
                          )}
                          {order.client?.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>
                                {order.client.address}
                                {order.client.city && `, ${order.client.city}`}
                                {order.client.postal_code &&
                                  ` (${order.client.postal_code})`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Información de la orden */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Detalles de la Orden
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              Creada:{" "}
                              {new Date(order.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            <span>
                              Método:{" "}
                              {paymentMethodConfig[order.payment_method]?.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span>
                              Entrega:{" "}
                              {order.delivery_method === "envio"
                                ? "Envío"
                                : "Retiro"}
                            </span>
                          </div>
                          {order.approved_at && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>
                                Pagado:{" "}
                                {new Date(order.approved_at).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Productos */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Productos</h3>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded"
                          >
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-600 ml-2">
                                x{item.quantity}
                              </span>
                            </div>
                            <span className="font-semibold">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <div className="flex justify-between items-center">
                          <span>Subtotal:</span>
                          <span>{formatPrice(order.total_amount)}</span>
                        </div>
                        {order.shipping_cost && order.shipping_cost > 0 && (
                          <div className="flex justify-between items-center">
                            <span>Envío:</span>
                            <span>{formatPrice(order.shipping_cost)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{formatPrice(getOrderTotal(order))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-3">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="pagado">Pagado</SelectItem>
                          <SelectItem value="enviado">Enviado</SelectItem>
                          <SelectItem value="entregado">Entregado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>

                      {order.payment_method === "transfer" &&
                        order.status === "pendiente" && (
                          <Button
                            onClick={() =>
                              updateOrderStatus(order.id, "pagado")
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Marcar como Pagado
                          </Button>
                        )}
                    </div>

                    {/* Follow-up para transferencias */}
                    {order.payment_method === "transfer" && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">
                          Seguimiento de Transferencia
                        </h4>
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Agregar nota de seguimiento..."
                            value={followUpNote}
                            onChange={(e) => setFollowUpNote(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => addFollowUpNote(order.id)}
                            disabled={!followUpNote.trim()}
                          >
                            Agregar Nota
                          </Button>
                        </div>

                        {order.notes && (
                          <div className="p-3 bg-gray-50 rounded">
                            <h5 className="font-medium mb-2">Notas:</h5>
                            <pre className="text-sm whitespace-pre-wrap">
                              {order.notes}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
