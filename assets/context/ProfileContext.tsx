// ProfileContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type Order = {
  id: string;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryOption: string;
  nonContact: boolean;
  date: string;
  totalAmount: number;
};

type ProfileContextType = {
  name: string;
  email: string;
  phone: string;
  address: string;
  setProfileData: (data: Partial<ProfileContextType>) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [address, setAddress] = useState("123 Green Street, Lahore, Pakistan");
  const [orders, setOrders] = useState<Order[]>([]);

  const setProfileData = (data: Partial<ProfileContextType>) => {
    if (data.name) setName(data.name);
    if (data.email) setEmail(data.email);
    if (data.phone) setPhone(data.phone);
    if (data.address) setAddress(data.address);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
  };

  return (
    <ProfileContext.Provider
      value={{ name, email, phone, address, setProfileData, orders, addOrder }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
