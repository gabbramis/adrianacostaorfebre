"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Tag,
  Edit,
  Trash2,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";
import { DiscountCode } from "@/app/admin/types/discount-codes";
import { toast } from "sonner";

export default function DiscountsCodePage() {
  const supabase = createSupabaseClient();
  const [discountsCodes, setDiscountsCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // GET DISCOUNTS CODES
  useEffect(() => {
    const getDiscountsCodes = async () => {
      try {
        const { data: discountsCodes } = (await supabase
          .from("discount_codes")
          .select(
            "id, name, type, value, discount_code, description, active, start_date, end_date"
          )
          .order("created_at", { ascending: false })) as {
          data: DiscountCode[];
        };

        if (discountsCodes) {
          setDiscountsCodes(discountsCodes);
        }
      } catch (error) {
        console.error("Error fetching discount codes:", error);
      } finally {
        setLoading(false);
      }
    };

    getDiscountsCodes();
  }, [supabase]);

  // CREATE NEW DISCOUNT CODE
  const handleCreateCode = async (formData: Partial<DiscountCode>) => {
    try {
      const response = await fetch("/api/discount-codes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCode = await response.json();
        setDiscountsCodes([newCode, ...discountsCodes]);
        setShowModal(false);
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating discount code:", error);
    }
  };

  // UPDATE DISCOUNT CODE
  const handleUpdateCode = async (formData: Partial<DiscountCode>) => {
    if (!editingCode) return;

    try {
      const response = await fetch(`/api/discount-codes/${editingCode.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedCode = await response.json();
        setDiscountsCodes(
          discountsCodes.map((code) =>
            code.id === editingCode.id ? updatedCode : code
          )
        );
        setShowModal(false);
        setEditingCode(null);
      }
    } catch (error) {
      console.error("Error updating discount code:", error);
    }
  };

  // DELETE DISCOUNT CODE
  const handleDeleteCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) return;

    try {
      const response = await fetch(`/api/discount-codes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDiscountsCodes(discountsCodes.filter((code) => code.id !== id));
      }
    } catch (error) {
      console.error("Error deleting discount code:", error);
    }
  };

  // TOGGLE ACTIVE STATUS
  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/discount-codes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });

      if (response.ok) {
        const updatedCode = await response.json();
        setDiscountsCodes(
          discountsCodes.map((code) => (code.id === id ? updatedCode : code))
        );
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
    }
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingCode(null);
    setShowModal(true);
  };

  const openEditModal = (code: DiscountCode) => {
    setIsCreating(false);
    setEditingCode(code);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCode(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Códigos de Descuento
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona códigos promocionales y descuentos
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Código
        </Button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Activos</span>
            </div>
            <p className="text-2xl font-semibold">
              {discountsCodes.filter((code) => code.active).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Inactivos</span>
            </div>
            <p className="text-2xl font-semibold">
              {discountsCodes.filter((code) => !code.active).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-semibold">{discountsCodes.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {discountsCodes.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No hay códigos de descuento
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crea tu primer código de descuento para comenzar
              </p>
              <Button onClick={openCreateModal} variant="outline">
                Crear código de descuento
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Nombre
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Código
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Descuento
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Período
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {discountsCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{code.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {code.description || "Sin descripción"}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="font-mono">
                          {code.discount_code}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {code.type === "percentage" ? (
                            <Percent className="h-4 w-4 text-green-600" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="font-medium">
                            {code.type === "percentage"
                              ? `${code.value}%`
                              : `$${code.value}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            handleToggleActive(code.id, !code.active)
                          }
                          className="text-left"
                        >
                          <Badge
                            variant={code.active ? "default" : "secondary"}
                          >
                            {code.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(code.start_date).toLocaleDateString()} -{" "}
                            {new Date(code.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => openEditModal(code)}
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCode(code.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DiscountCodeModal
          code={editingCode}
          isCreating={isCreating}
          onSave={(data) => {
            if (isCreating) {
              handleCreateCode(data);
            } else {
              handleUpdateCode(data);
            }
          }}
          onClose={closeModal}
        />
      </Dialog>
    </div>
  );
}

function DiscountCodeModal({
  code,
  isCreating,
  onSave,
  onClose,
}: {
  code: DiscountCode | null;
  isCreating: boolean;
  onSave: (data: Partial<DiscountCode>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: code?.name || "",
    type: code?.type || "percentage",
    value: code?.value || 0,
    discount_code: code?.discount_code || "",
    description: code?.description || "",
    active: code?.active ?? true,
    start_date: code?.start_date || new Date().toISOString().split("T")[0],
    end_date:
      code?.end_date ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "percentage",
      value: 0,
      discount_code: "",
      description: "",
      active: true,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === "percentage" && formData.value > 100) {
      toast.error("El valor debe ser menor o igual a 100");
      return;
    }
    onSave(formData);
    if (isCreating) resetForm();
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {isCreating
            ? "Crear nuevo código promocional"
            : "Editar código promocional"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Dia de la madre"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_code">Código</Label>
            <Input
              id="discount_code"
              value={formData.discount_code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount_code: e.target.value.toUpperCase(),
                })
              }
              placeholder="MAMA25"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={
                (value) =>
                  setFormData({
                    ...formData,
                    type: value as "percentage" | "flat_rate",
                    value: 0,
                  }) // Reset value when type changes
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Porcentaje</SelectItem>
                <SelectItem value="flat_rate">Monto Fijo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            <div className="relative">
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => {
                  const inputValue = Number(e.target.value);
                  let validatedValue = inputValue;

                  // Validation for percentage (0-100)
                  if (formData.type === "percentage") {
                    if (inputValue > 100) {
                      validatedValue = 100;
                    } else if (inputValue < 0) {
                      validatedValue = 0;
                    }
                  }
                  // Validation for flat rate (positive numbers only)
                  else if (formData.type === "flat_rate") {
                    if (inputValue < 0) {
                      validatedValue = 0;
                    }
                  }

                  setFormData({ ...formData, value: validatedValue });
                }}
                onBlur={(e) => {
                  const inputValue = Number(e.target.value);
                  let validatedValue = inputValue;

                  // Validation for percentage (0-100)
                  if (formData.type === "percentage") {
                    if (inputValue > 100) {
                      validatedValue = 100;
                    } else if (inputValue < 0) {
                      validatedValue = 0;
                    }
                  }
                  // Validation for flat rate (positive numbers only)
                  else if (formData.type === "flat_rate") {
                    if (inputValue < 0) {
                      validatedValue = 0;
                    }
                  }

                  setFormData({ ...formData, value: validatedValue });
                }}
                required
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <span className="text-muted-foreground text-sm">
                  {formData.type === "percentage" ? "%" : "$"}
                </span>
              </div>
            </div>
            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
              {formData.type === "percentage"
                ? "Ingresa un valor entre 0 y 100%"
                : "Ingresa un monto mayor a 0"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Celebra a mamá con un descuento del 25% en todos nuestros productos"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha Inicial</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha Final</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, active: checked })
            }
          />
          <Label htmlFor="active">Activo</Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{isCreating ? "Crear" : "Actualizar"}</Button>
        </div>
      </form>
    </DialogContent>
  );
}
