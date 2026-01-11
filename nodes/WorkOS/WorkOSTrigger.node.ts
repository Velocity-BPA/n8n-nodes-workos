/**
 * WorkOS Trigger Node for n8n
 *
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 * See LICENSE file for details
 */

import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { createHmac } from 'crypto';
import { WEBHOOK_EVENTS, LICENSING_NOTICE } from './constants/constants';

// Log licensing notice on module load
console.warn(LICENSING_NOTICE);

export class WorkOsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WorkOS Trigger',
		name: 'workOsTrigger',
		icon: 'file:workos.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when WorkOS events occur',
		defaults: {
			name: 'WorkOS Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'workOsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: WEBHOOK_EVENTS,
				default: [],
				required: true,
				description: 'The events to listen for',
			},
			{
				displayName: 'Verify Signature',
				name: 'verifySignature',
				type: 'boolean',
				default: true,
				description:
					'Whether to verify the webhook signature using the webhook secret',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// WorkOS webhooks are managed through the dashboard or API
				// We always return false to allow the webhook to be created
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// WorkOS webhooks need to be created manually in the dashboard
				// or via the API. This just returns true to indicate the webhook
				// endpoint is ready to receive events.
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				console.log(`WorkOS Trigger webhook URL: ${webhookUrl}`);
				console.log(
					'Please register this URL in your WorkOS Dashboard under Webhooks.'
				);
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// WorkOS webhooks need to be deleted manually in the dashboard
				// or via the API.
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;
		const events = this.getNodeParameter('events') as string[];
		const verifySignature = this.getNodeParameter('verifySignature') as boolean;

		// Get the raw body for signature verification
		const req = this.getRequestObject();

		// Verify signature if enabled
		if (verifySignature) {
			const credentials = await this.getCredentials('workOsApi');
			const webhookSecret = credentials.webhookSecret as string;

			if (!webhookSecret) {
				console.warn(
					'WorkOS Trigger: Webhook secret not configured. Signature verification skipped.'
				);
			} else {
				const signature = headers['workos-signature'] as string;

				if (!signature) {
					console.error('WorkOS Trigger: No signature found in request headers');
					return {
						webhookResponse: { status: 401, body: 'Unauthorized: Missing signature' },
					};
				}

				// Parse the signature header
				// Format: t=timestamp,v1=signature
				const signatureParts: { [key: string]: string } = {};
				signature.split(',').forEach((part) => {
					const [key, value] = part.split('=');
					signatureParts[key] = value;
				});

				const timestamp = signatureParts['t'];
				const signatureHash = signatureParts['v1'];

				if (!timestamp || !signatureHash) {
					console.error('WorkOS Trigger: Invalid signature format');
					return {
						webhookResponse: { status: 401, body: 'Unauthorized: Invalid signature format' },
					};
				}

				// Check timestamp to prevent replay attacks (5 minute tolerance)
				const currentTime = Math.floor(Date.now() / 1000);
				const webhookTime = parseInt(timestamp, 10);
				const timeDifference = Math.abs(currentTime - webhookTime);

				if (timeDifference > 300) {
					console.error('WorkOS Trigger: Webhook timestamp too old');
					return {
						webhookResponse: { status: 401, body: 'Unauthorized: Timestamp too old' },
					};
				}

				// Get raw body
				let rawBody: string;
				if (typeof req.rawBody === 'string') {
					rawBody = req.rawBody;
				} else if (Buffer.isBuffer(req.rawBody)) {
					rawBody = req.rawBody.toString('utf8');
				} else {
					rawBody = JSON.stringify(bodyData);
				}

				// Compute expected signature
				const signedPayload = `${timestamp}.${rawBody}`;
				const expectedSignature = createHmac('sha256', webhookSecret)
					.update(signedPayload)
					.digest('hex');

				// Compare signatures
				if (signatureHash !== expectedSignature) {
					console.error('WorkOS Trigger: Signature verification failed');
					return {
						webhookResponse: { status: 401, body: 'Unauthorized: Invalid signature' },
					};
				}
			}
		}

		// Extract event type from the payload
		const eventType = bodyData.event as string;

		// Check if this event is one we're listening for
		if (events.length > 0 && !events.includes(eventType)) {
			// Event not in our list, acknowledge but don't trigger workflow
			return {
				webhookResponse: { status: 200, body: 'Event ignored' },
			};
		}

		// Return the event data
		return {
			workflowData: [
				this.helpers.returnJsonArray([
					{
						event: eventType,
						id: bodyData.id,
						data: bodyData.data,
						createdAt: bodyData.created_at,
						rawPayload: bodyData,
					},
				]),
			],
		};
	}
}
