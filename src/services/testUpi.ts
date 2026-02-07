// Test UPI IDs for demonstration purposes
export const TEST_UPI_IDS = {
	SUCCESS: {
		id: "test@paytm",
		description: "Always succeeds",
	},
	SUCCESS_2: {
		id: "demo@googlepay",
		description: "Always succeeds",
	},
	SUCCESS_3: {
		id: "success@phonepe",
		description: "Always succeeds",
	},
} as const;

// Common UPI providers
export const UPI_PROVIDERS = [
	{ name: "Paytm", suffix: "@paytm" },
	{ name: "Google Pay", suffix: "@googlepay" },
	{ name: "PhonePe", suffix: "@phonepe" },
	{ name: "Amazon Pay", suffix: "@apl" },
	{ name: "Bhim UPI", suffix: "@upi" },
	{ name: "Yes Bank", suffix: "@ybl" },
	{ name: "HDFC Bank", suffix: "@hdfcbank" },
	{ name: "ICICI Bank", suffix: "@icici" },
] as const;
