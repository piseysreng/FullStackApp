export const orders= [
  {
    "order_id": 1001,
    "customer_id": 502,
    "placed_at": "2026-01-10T09:15:00Z",
    "confirmed_at": "2026-01-10T09:45:00Z",
    "shipped_at": "2026-01-11T14:20:00Z",
    "out_for_delivery_at": "2026-01-13T08:00:00Z",
    "delivered_at": "2026-01-13T13:30:00Z",
    "total_amount": 125.50,
    "total_quantity": 3,
    "current_status": "delivered"
  },
  {
    "order_id": 1002,
    "customer_id": 784,
    "placed_at": "2026-01-12T11:00:00Z",
    "confirmed_at": "2026-01-12T11:15:00Z",
    "shipped_at": "2026-01-13T10:00:00Z",
    "out_for_delivery_at": "2026-01-13T15:45:00Z",
    "delivered_at": "",
    "total_amount": 45.00,
    "total_quantity": 1,
    "current_status": "out_for_delivery"
  },
  {
    "order_id": 1003,
    "customer_id": 312,
    "placed_at": "2026-01-13T08:30:00Z",
    "confirmed_at": "2026-01-13T09:00:00Z",
    "shipped_at": "",
    "out_for_delivery_at": "",
    "delivered_at": "",
    "total_amount": 210.99,
    "total_quantity": 5,
    "current_status": "confirmed"
  },
  {
    "order_id": 1004,
    "customer_id": 502,
    "placed_at": "2026-01-13T14:00:00Z",
    "confirmed_at": "",
    "shipped_at": "",
    "out_for_delivery_at": "",
    "delivered_at": "",
    "total_amount": 89.25,
    "total_quantity": 2,
    "current_status": "placed"
  },
  {
    "order_id": 1005,
    "customer_id": 991,
    "placed_at": "2026-01-11T16:45:00Z",
    "confirmed_at": "2026-01-11T17:30:00Z",
    "shipped_at": "2026-01-12T09:00:00Z",
    "out_for_delivery_at": "",
    "delivered_at": "",
    "total_amount": 320.00,
    "total_quantity": 8,
    "current_status": "shipped"
  }
]


export const orderItems = [
  {
    "id": 1,
    "order_id": 1001,
    "product_id": 1,
    "product_quantity": 1
  },
  {
    "id": 2,
    "order_id": 1001,
    "product_id": 16,
    "product_quantity": 2
  },
  {
    "id": 3,
    "order_id": 1002,
    "product_id": 2,
    "product_quantity": 1
  },
  {
    "id": 4,
    "order_id": 1003,
    "product_id": 4,
    "product_quantity": 2
  },
  {
    "id": 5,
    "order_id": 1003,
    "product_id": 9,
    "product_quantity": 3
  },
  {
    "id": 6,
    "order_id": 1004,
    "product_id": 11,
    "product_quantity": 1
  },
  {
    "id": 7,
    "order_id": 1004,
    "product_id": 14,
    "product_quantity": 1
  },
  {
    "id": 8,
    "order_id": 1005,
    "product_id": 8,
    "product_quantity": 5
  },
  {
    "id": 9,
    "order_id": 1005,
    "product_id": 20,
    "product_quantity": 3
  }
]