export interface PaymentDetails {
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	cardholder: string;
}

export interface PaymentResponse {
	success: boolean;
	transactionId?: string;
	message: string;
}

// Validate card number using Luhn algorithm
function validateCardNumber(cardNumber: string): boolean {
	const digits = cardNumber.replace(/\D/g, "");
	if (digits.length !== 16) return false;

	let sum = 0;
	let isEven = false;

	for (let i = digits.length - 1; i >= 0; i--) {
		let digit = parseInt(digits[i], 10);

		if (isEven) {
			digit *= 2;
			if (digit > 9) {
				digit -= 9;
			}
		}

		sum += digit;
		isEven = !isEven;
	}

	return sum % 10 === 0;
}

// Validate expiry date
function validateExpiryDate(expiryDate: string): boolean {
	const [month, year] = expiryDate.split("/");
	if (!month || !year) return false;

	const monthNum = parseInt(month, 10);
	const yearNum = parseInt(year, 10);

	if (monthNum < 1 || monthNum > 12) return false;

	const currentYear = new Date().getFullYear() % 100;
	const currentMonth = new Date().getMonth() + 1;

	if (yearNum < currentYear) return false;
	if (yearNum === currentYear && monthNum < currentMonth) return false;

	return true;
}

// Simulate payment processing
export async function processPayment(
	amount: number,
	paymentDetails: PaymentDetails
): Promise<PaymentResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			// Validation
			if (!paymentDetails.cardholder.trim()) {
				resolve({
					success: false,
					message: "Cardholder name is required",
				});
				return;
			}

			if (!validateCardNumber(paymentDetails.cardNumber)) {
				resolve({
					success: false,
					message: "Invalid card number",
				});
				return;
			}

			if (!validateExpiryDate(paymentDetails.expiryDate)) {
				resolve({
					success: false,
					message: "Card has expired or invalid expiry date",
				});
				return;
			}

			if (paymentDetails.cvv.length !== 3) {
				resolve({
					success: false,
					message: "Invalid CVV",
				});
				return;
			}

			// Simulate 90% success rate
			const isSuccess = Math.random() < 0.9;

			if (isSuccess) {
				resolve({
					success: true,
					transactionId: `TXN-${Date.now()}`,
					message: "Payment successful",
				});
			} else {
				resolve({
					success: false,
					message: "Payment declined. Please try again.",
				});
			}
		}, 2000);
	});
}
