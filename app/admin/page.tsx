"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  ShoppingCart,
  Mail,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { createSupabaseClient } from "@/utils/supabase/client";
import Link from "next/link";

interface DashboardStats {
  // Productos
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  publishedProducts: number;

  // Órdenes
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  totalRevenue: number;

  // Contactos
  totalContacts: number;
  newContacts: number;
  pendingContacts: number;

  // Tendencias
  revenueGrowth: number;
  ordersGrowth: number;
}

interface RecentOrder {
  id: string;
  client_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  category: string;
}

interface RecentContact {
  id: string;
  nombre: string;
  email: string;
  tipo_consulta: string;
  estado: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    publishedProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    totalContacts: 0,
    newContacts: 0,
    pendingContacts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    []
  );
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createSupabaseClient();
      const today = new Date().toISOString().split("T")[0];
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Fetch products data
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) throw productsError;

      // Fetch orders data
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*, clients(first_name, last_name)")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch contacts data
      const { data: contacts, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (contactsError) throw contactsError;

      // Calculate stats
      const totalProducts = products?.length || 0;
      const lowStock =
        products?.filter((p) => p.stock && p.stock <= 5 && p.stock > 0) || [];
      const outOfStock =
        products?.filter((p) => !p.stock || p.stock <= 0) || [];
      const published = products?.filter((p) => p.is_posted) || [];

      const totalOrders = orders?.length || 0;
      const pendingOrders =
        orders?.filter((o) => o.status === "pendiente").length || 0;
      const completedOrders =
        orders?.filter((o) => o.status === "entregado").length || 0;
      const todayOrders =
        orders?.filter((o) => o.created_at.startsWith(today)).length || 0;
      const totalRevenue =
        orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      const totalContacts = contacts?.length || 0;
      const newContacts =
        contacts?.filter((c) => c.estado === "nuevo").length || 0;
      const pendingContacts =
        contacts?.filter((c) => c.estado === "leido").length || 0;

      // Calculate growth (simplified)
      const thisWeekOrders =
        orders?.filter((o) => o.created_at >= lastWeek).length || 0;
      const lastWeekOrders = totalOrders - thisWeekOrders;
      const ordersGrowth =
        lastWeekOrders > 0
          ? ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100
          : 0;

      const thisWeekRevenue =
        orders
          ?.filter((o) => o.created_at >= lastWeek)
          .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const lastWeekRevenue = totalRevenue - thisWeekRevenue;
      const revenueGrowth =
        lastWeekRevenue > 0
          ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
          : 0;

      setStats({
        totalProducts,
        lowStockProducts: lowStock.length,
        outOfStockProducts: outOfStock.length,
        publishedProducts: published.length,
        totalOrders,
        pendingOrders,
        completedOrders,
        todayOrders,
        totalRevenue,
        totalContacts,
        newContacts,
        pendingContacts,
        revenueGrowth,
        ordersGrowth,
      });

      // Set recent data
      setRecentOrders(
        orders?.slice(0, 5).map((order) => ({
          id: order.id,
          client_name: order.clients
            ? `${order.clients.first_name} ${order.clients.last_name}`
            : "Cliente desconocido",
          total_amount: order.total_amount || 0,
          status: order.status,
          created_at: order.created_at,
        })) || []
      );

      setLowStockProducts(
        lowStock.slice(0, 5).map((product) => ({
          id: product.id,
          name: product.name,
          stock: product.stock || 0,
          category: product.category,
        }))
      );

      setRecentContacts(
        contacts?.slice(0, 5).map((contact) => ({
          id: contact.id,
          nombre: contact.nombre,
          email: contact.email,
          tipo_consulta: contact.tipo_consulta,
          estado: contact.estado,
          created_at: contact.created_at,
        })) || []
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "pagado":
        return "bg-green-100 text-green-800";
      case "enviado":
        return "bg-blue-100 text-blue-800";
      case "entregado":
        return "bg-purple-100 text-purple-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContactStatusColor = (status: string) => {
    switch (status) {
      case "nuevo":
        return "bg-blue-100 text-blue-800";
      case "leido":
        return "bg-yellow-100 text-yellow-800";
      case "respondido":
        return "bg-green-100 text-green-800";
      case "cerrado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Resumen de tu negocio -{" "}
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPrice(stats.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-2">
                    {stats.revenueGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-300 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-300 mr-1" />
                    )}
                    <span className="text-sm text-blue-100">
                      {stats.revenueGrowth.toFixed(1)}% vs semana pasada
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Órdenes Totales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {stats.pendingOrders} pendientes
                    </span>
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Productos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProducts}
                  </p>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {stats.lowStockProducts} con poco stock
                    </span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Contacts Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Contactos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalContacts}
                  </p>
                  <div className="flex items-center mt-2">
                    <Mail className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {stats.newContacts} nuevos
                    </span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Órdenes Hoy</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.todayOrders}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Productos Publicados</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.publishedProducts}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Sin Stock</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.outOfStockProducts}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Órdenes Recientes</CardTitle>
              <Link href="/admin/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No hay órdenes recientes
                  </p>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {order.client_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(order.total_amount)}
                        </span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Contactos Recientes</CardTitle>
              <Link href="/admin/contacts">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver todos
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No hay contactos recientes
                  </p>
                ) : (
                  recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {contact.nombre}
                        </p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(contact.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={getContactStatusColor(contact.estado)}
                        >
                          {contact.estado}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {contact.tipo_consulta}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Productos con Poco Stock
              </CardTitle>
              <Link href="/admin/products">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-300 hover:bg-orange-100"
                >
                  Gestionar inventario
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-orange-600">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
