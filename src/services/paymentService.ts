export interface PaymentDetails {
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	cardholder: string;
}

export interface UpiDetails {
	upiId: string;
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

			// Test cards always succeed
			const testCards = ['4532015112830366', '5425233010103442', '4111111111111111'];
			const isTestCard = testCards.includes(paymentDetails.cardNumber.replace(/\s/g, ''));

			// Test cards = 100% success, others = 90% success
			const isSuccess = isTestCard ? true : Math.random() < 0.9;

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

// Validate UPI ID
function validateUpiId(upiId: string): boolean {
	// UPI ID format: username@bankname
	const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
	return upiRegex.test(upiId);
}

// Simulate UPI payment processing
export async function processUpiPayment(
	amount: number,
	upiDetails: UpiDetails
): Promise<PaymentResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			// Validation
			if (!upiDetails.upiId.trim()) {
				resolve({
					success: false,
					message: "UPI ID is required",
				});
				return;
			}

			if (!validateUpiId(upiDetails.upiId)) {
				resolve({
					success: false,
					message: "Invalid UPI ID format. Use format: username@bankname",
				});
				return;
			}

			// Test UPI IDs for demo (always succeed)
			const testUpiIds = ['test@paytm', 'demo@googlepay', 'success@phonepe'];
			const isTestUpi = testUpiIds.includes(upiDetails.upiId.toLowerCase());

			// Test UPIs = 100% success, others = 95% success
			const isSuccess = isTestUpi ? true : Math.random() < 0.95;

			if (isSuccess) {
				resolve({
					success: true,
					transactionId: `UPI-${Date.now()}`,
					message: "UPI payment successful",
				});
			} else {
				resolve({
					success: false,
					message: "UPI payment failed. Please verify your UPI ID and try again.",
				});
			}
		}, 2000);
	});
}
