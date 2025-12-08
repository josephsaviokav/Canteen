"use client";

import { createContext, useContext, useState } from "react";

export interface Payment {
	id: string;
	orderId: string;
	amount: number;
	status: "pending" | "completed" | "failed";
	transactionId?: string;
	createdAt: Date;
	lastFour?: string;
}

interface PaymentContextType {
	payments: Payment[];
	addPayment: (orderId: string, amount: number, transactionId: string, lastFour: string) => Payment;
	updatePaymentStatus: (paymentId: string, status: Payment["status"]) => void;
	getPaymentByOrderId: (orderId: string) => Payment | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
	const [payments, setPayments] = useState<Payment[]>([]);

	const addPayment = (
		orderId: string,
		amount: number,
		transactionId: string,
		lastFour: string
	): Payment => {
		const newPayment: Payment = {
			id: `PAY-${Date.now()}`,
			orderId,
			amount,
			status: "completed",
			transactionId,
			lastFour,
			createdAt: new Date(),
		};
		setPayments((prev) => [newPayment, ...prev]);
		return newPayment;
	};

	const updatePaymentStatus = (paymentId: string, status: Payment["status"]) => {
		setPayments((prev) =>
			prev.map((payment) =>
				payment.id === paymentId ? { ...payment, status } : payment
			)
		);
	};

	const getPaymentByOrderId = (orderId: string) => {
		return payments.find((payment) => payment.orderId === orderId);
	};

	return (
		<PaymentContext.Provider
			value={{
				payments,
				addPayment,
				updatePaymentStatus,
				getPaymentByOrderId,
			}}
		>
			{children}
		</PaymentContext.Provider>
	);
}

export function usePayment() {
	const context = useContext(PaymentContext);
	if (!context) {
		throw new Error("usePayment must be used within PaymentProvider");
	}
	return context;
}
