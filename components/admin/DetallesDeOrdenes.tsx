//components/detalledeordenes
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Order {
  id: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export default function DetallesDeOrdenes({ orders }: { orders: Order[] }) {
  console.log(orders);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Ordenes</CardTitle>
          <CardDescription>Detalles de las ordenes</CardDescription>
        </CardHeader>
        <CardContent>
          {orders?.map((order: Order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <p>{order.id}</p>
                <p>{order.total_amount}</p>
                <p>{order.created_at}</p>
                <p>{order.updated_at}</p>
              </div>
              <Button variant="outline">Ver Detalles</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
