"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Filter,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Contact, ContactStatus } from "@/app/admin/types/mails";

export default function AdminContactsPanel() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Cargar contactos
  useEffect(() => {
    fetchContacts();
  }, []);

  // Filtrar contactos
  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.asunto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => contact.estado === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (contact) => contact.tipo_consulta === typeFilter
      );
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter, typeFilter]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contacts");

      if (!response.ok) {
        throw new Error("Error al cargar contactos");
      }

      const data = await response.json();
      setContacts(data.contacts || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError(
        error instanceof Error ? error.message : "Error al cargar contactos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado");
      }

      // Actualizar el estado local
      setContacts(
        contacts.map((contact) =>
          contact.id === contactId
            ? { ...contact, estado: newStatus as ContactStatus }
            : contact
        )
      );

      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact({
          ...selectedContact,
          estado: newStatus as ContactStatus,
        });
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      setError(error instanceof Error ? error.message : "Error al actualizar");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "nuevo":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "leido":
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case "respondido":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cerrado":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "personalizado":
        return "bg-purple-100 text-purple-800";
      case "reparacion":
        return "bg-orange-100 text-orange-800";
      case "presupuesto":
        return "bg-indigo-100 text-indigo-800";
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Gestión de Contactos</h1>
        <Button onClick={fetchContacts} variant="outline">
          Actualizar
        </Button>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {contacts.filter((c) => c.estado === "nuevo").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {contacts.filter((c) => c.estado === "leido").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Respondidos</p>
                <p className="text-2xl font-bold text-green-600">
                  {contacts.filter((c) => c.estado === "respondido").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o asunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="leido">Leído</SelectItem>
                <SelectItem value="respondido">Respondido</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
                <SelectItem value="reparacion">Reparación</SelectItem>
                <SelectItem value="presupuesto">Presupuesto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de contactos */}
      <Card>
        <CardHeader>
          <CardTitle>Contactos ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.nombre}
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(contact.tipo_consulta)}>
                        {contact.tipo_consulta}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contact.estado)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(contact.estado)}
                          {contact.estado}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(contact.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact);
                            setIsDetailOpen(true);
                            if (contact.estado === "nuevo") {
                              updateContactStatus(contact.id, "leido");
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={contact.estado}
                          onValueChange={(value) =>
                            updateContactStatus(contact.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nuevo">Nuevo</SelectItem>
                            <SelectItem value="leido">Leído</SelectItem>
                            <SelectItem value="respondido">
                              Respondido
                            </SelectItem>
                            <SelectItem value="cerrado">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalle */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Contacto</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Nombre
                  </label>
                  <p className="font-medium">{selectedContact.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p>{selectedContact.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Teléfono
                  </label>
                  <p>{selectedContact.telefono || "No proporcionado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Tipo de consulta
                  </label>
                  <Badge
                    className={getTypeColor(selectedContact.tipo_consulta)}
                  >
                    {selectedContact.tipo_consulta}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Asunto
                </label>
                <p className="font-medium">{selectedContact.asunto}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Mensaje
                </label>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">
                    {selectedContact.mensaje}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Estado
                  </label>
                  <Badge className={getStatusColor(selectedContact.estado)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedContact.estado)}
                      {selectedContact.estado}
                    </span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Fecha de contacto
                  </label>
                  <p>{formatDate(selectedContact.created_at)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
