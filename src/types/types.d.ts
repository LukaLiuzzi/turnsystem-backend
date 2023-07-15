export interface User {
  id: number
  username: string
  password: string
  email: string
  phone_number: string
}

export interface Client {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

export enum TurnStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  CANCELLED = "Cancelled",
}
export interface Turn {
  client_id: number
  date: string
  time: string
  status: TurnStatus
  service_id: number
}

export interface Service {
  name: string
  description: string
  price: number
}

export enum PaymentStatus {
  PENDING = "Pending",
  PAID = "Paid",
}
export interface Payment {
  turn_id: number
  amount: number
  status: PaymentStatus
}

export interface Administrator {
  user_id: number
}
