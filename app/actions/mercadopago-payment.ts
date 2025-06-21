"use server";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.ML_ACCESS_TOKEN!,
});

export async function mercadopagoPayment(formData: FormData) {
  const preference = new Preference(client);
  const productName = formData.get("productName");
  const productPrice = formData.get("productPrice");
  const productQuantity = formData.get("productQuantity");

  const preferenceResponse = await preference.create({
    body: {
      items: [
        {
          id: "1",
          title: `${productName}`,
          quantity: Number(productQuantity),
          unit_price: Number(productPrice),
        },
      ],
    },
  });

  const preferenceId = preferenceResponse.id;
  const url = preferenceResponse.init_point;

  console.log(preferenceId);
  console.log(url);

  return url;
}
