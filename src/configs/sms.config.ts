import logger from "./logger.config";

/**
 * Represents the structure of the response data from the API.
 */
interface IData {
	status: number;
	message?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data?: any;
}

/**
 * Represents a class for interacting with the SMS1.ir API.
 */
export class Sms1ir {
	/**
	 * The API key used for requests without a pattern.
	 */
	private apiKeyWithoutPattern: string;

	/**
	 * The API key used for requests with a pattern.
	 */
	private apiKeyWithPattern: string | null;

	/**
	 * The base URL of the SMS1.ir API.
	 */
	private apiUrl: string = "https://app.sms1.ir:7001/api/service/";

	/**
	 * The maximum number of retries for sending SMS messages.
	 */
	private maxRetries: number = 3;

	/**
	 * The interval between retry attempts in milliseconds.
	 */
	private retryInterval: number = 1000;

	/**
	 * Constructs a new Sms1ir instance.
	 * @param apiKeyWithoutPattern The API key used for requests without a pattern.
	 * @param apiKeyWithPattern The API key used for requests with a pattern.
	 */
	constructor(apiKeyWithoutPattern: string, apiKeyWithPattern?: string) {
		this.apiKeyWithoutPattern = apiKeyWithoutPattern;
		this.apiKeyWithPattern = apiKeyWithPattern ?? null;
	}

	/**
	 * Makes a request to the SMS1.ir API.
	 * @param urlSuffix The endpoint suffix for the API URL.
	 * @param method The HTTP method for the request.
	 * @param data The data to be sent with the request.
	 * @param usePatternApiKey Specifies whether to use the API key for requests with a pattern.
	 * @returns A promise that resolves with the API response data.
	 */
	private async Api(
		urlSuffix: string,
		method: "GET" | "POST" | "DELETE" = "POST",
		data: object | undefined = undefined,
		usePatternApiKey: boolean = false
	): Promise<IData> {
		const url = `${this.apiUrl}${urlSuffix}`;
		const apiKey = usePatternApiKey
			? this.apiKeyWithPattern
			: this.apiKeyWithoutPattern;

		const response = await fetch(url, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			method,
			body: JSON.stringify(data),
		});

		logger.info("Response Status:", response.status);

		const contentType = response.headers.get("content-type");
		if (
			response.status == 200 &&
			(!contentType || !contentType.includes("application/json"))
		) {
			return { status: 200 };
		}

		try {
			const responseBody = await response.json();
			logger.info("Response Body:", responseBody);
			return responseBody as IData;
		} catch (error) {
			logger.error("Error parsing JSON:", error);
			throw new Error("Invalid JSON response from server");
		}
	}

	/**
	 * Sends a standard SMS message.
	 * @param message The message content.
	 * @param recipient The recipient's phone number.
	 * @returns A promise that resolves with the API response data.
	 */
	async send(message: string, recipient: string) {
		try {
			const responseBody = await this.Api("send", "POST", {
				message,
				recipient,
			});
			return responseBody;
		} catch (error) {
			logger.error("Error sending SMS:", error);
			throw new Error("Failed to send SMS");
		}
	}

	/**
	 * Sends a verification code SMS message with retry and pattern support.
	 * @param verificationCode The verification code to send.
	 * @param recipient The recipient's phone number.
	 * @param patternId The ID of the pattern to use for the SMS.
	 * @returns A promise that resolves with the API response data.
	 */
	async sendVerificationCode(
		verificationCode: string,
		recipient: string,
		patternId: number
	) {
		// const message = `Your verification code is: ${verificationCode}`;
		try {
			const sendWithPattern = await this.sendWithPattern(
				patternId,
				recipient,
				{
					otpCode: verificationCode,
				}
			);
			return sendWithPattern;
		} catch (error) {
			logger.error("Error sending verification code:", error);
			throw new Error("Failed to send verification code");
		}
	}

	/**
	 * Sends an SMS message using a predefined pattern.
	 * @param patternId The ID of the pattern to use for the SMS.
	 * @param recipient The recipient's phone number.
	 * @param pairs The key-value pairs to replace in the pattern.
	 * @returns A promise that resolves with the API response data.
	 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async  sendWithPattern(patternId: number, recipient: string, pairs: any) {
		try {
			const responseBody = await this.Api(
				"patternSend",
				"POST",
				{
					patternId,
					recipient,
					pairs,
				},
				true
			);
			return responseBody;
		} catch (error) {
			logger.error("Error sending SMS with pattern:", error);
			throw new Error("Failed to send SMS with pattern");
		}
	}

	/**
	 * Sends an SMS message with retry support.
	 * @param message The message content.
	 * @param recipient The recipient's phone number.
	 * @param retries The number of retry attempts.
	 * @returns A promise that resolves with the API response data.
	 */
	private async sendWithRetry(
		message: string,
		recipient: string,
		retries: number = 0
	): Promise<IData> {
		try {
			const responseBody = await this.Api("send", "POST", {
				message,
				recipient,
			});
			return responseBody;
		} catch (error) {
			logger.error(`Error sending SMS to ${recipient}:`, error);
			if (retries < this.maxRetries) {
				logger.info(
					`Retrying SMS to ${recipient} (retry ${retries + 1} of ${
						this.maxRetries
					})`
				);
				await new Promise((resolve) =>
					setTimeout(resolve, this.retryInterval)
				);
				return this.sendWithRetry(message, recipient, retries + 1);
			} else {
				logger.error(
					`Failed to send SMS to ${recipient} after ${this.maxRetries} retries`
				);
				throw new Error("Failed to send SMS");
			}
		}
	}
}

// Export the Sms1ir class as the default export
export default Sms1ir;
