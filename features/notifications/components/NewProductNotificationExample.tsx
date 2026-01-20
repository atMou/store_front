"use client";

import { useNotifications } from "../hooks/useNotifications";
import Image from "next/image";


export function NewProductNotificationExample() {
  const { notifications, isConnected } = useNotifications();

  const newProductNotifications = notifications.filter(
    (n) => n.type === "newProduct"
  );

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">
        New Product Notifications
        {isConnected ? " ✓ Connected" : " ✗ Disconnected"}
      </h3>

      {newProductNotifications.length === 0 ? (
        <p className="text-gray-500">No new products yet</p>
      ) : (
        <div className="space-y-2">
          {newProductNotifications.map((notification) => {
            // Access the product data from notification.data
            const productData = notification.data as {
              productId: string;
              slug: string;
              name: string;
              price: number;
              imageUrl: string;
              category: string;
            };

            return (
              <div
                key={notification.id}
                className="p-3 border rounded bg-pink-50"
              >
                <div className="flex items-center gap-3">
                  {productData?.imageUrl && (
                    <Image
                      src={productData.imageUrl}
                      alt={productData.name}
                      className="w-16 h-16 object-cover rounded"
                      width={64}
                      height={64}
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    {productData && (
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="font-semibold">
                          ${productData.price}
                        </span>{" "}
                        • {productData.category}
                      </div>
                    )}
                    <a
                      href={`/product/${productData?.slug}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Product →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
