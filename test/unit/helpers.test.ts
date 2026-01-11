/**
 * Unit tests for WorkOS helpers
 *
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 * See LICENSE file for details
 */

import {
	verifyWebhookSignature,
	formatDate,
	isValidEmail,
	isValidUrl,
	cleanEmptyProperties,
	parseJsonParameter,
} from '../../nodes/WorkOS/utils/helpers';

describe('WorkOS Helpers', () => {
	describe('verifyWebhookSignature', () => {
		const secret = 'test_webhook_secret';
		const payload = '{"event":"user.created","data":{}}';

		it('should return true for valid signature with current timestamp', () => {
			const crypto = require('crypto');
			// Use current timestamp
			const timestamp = Math.floor(Date.now() / 1000).toString();
			const signedPayload = `${timestamp}.${payload}`;
			const expectedSignature = crypto
				.createHmac('sha256', secret)
				.update(signedPayload)
				.digest('hex');
			const signatureHeader = `t=${timestamp},v1=${expectedSignature}`;

			const result = verifyWebhookSignature(payload, signatureHeader, secret);
			expect(result).toBe(true);
		});

		it('should return false for invalid signature', () => {
			const timestamp = Math.floor(Date.now() / 1000).toString();
			const signatureHeader = `t=${timestamp},v1=invalid_signature`;
			const result = verifyWebhookSignature(payload, signatureHeader, secret);
			expect(result).toBe(false);
		});

		it('should return false for malformed signature header', () => {
			const result = verifyWebhookSignature(payload, 'malformed', secret);
			expect(result).toBe(false);
		});

		it('should return false for expired timestamp', () => {
			const crypto = require('crypto');
			// Use a timestamp that's more than 5 minutes old
			const timestamp = (Math.floor(Date.now() / 1000) - 400).toString();
			const signedPayload = `${timestamp}.${payload}`;
			const expectedSignature = crypto
				.createHmac('sha256', secret)
				.update(signedPayload)
				.digest('hex');
			const signatureHeader = `t=${timestamp},v1=${expectedSignature}`;

			const result = verifyWebhookSignature(payload, signatureHeader, secret);
			expect(result).toBe(false);
		});
	});

	describe('formatDate', () => {
		it('should format Date object to ISO string', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = formatDate(date);
			expect(result).toBe('2024-01-15T10:30:00.000Z');
		});

		it('should pass through string dates without T', () => {
			const dateStr = '2024-01-15';
			const result = formatDate(dateStr);
			expect(result).toBe('2024-01-15');
		});

		it('should format ISO string dates with T', () => {
			const dateStr = '2024-01-15T10:30:00.000Z';
			const result = formatDate(dateStr);
			expect(result).toBe('2024-01-15T10:30:00.000Z');
		});

		it('should convert timestamp to ISO string', () => {
			// January 15, 2024 10:30:00 UTC
			const timestamp = Date.UTC(2024, 0, 15, 10, 30, 0);
			const result = formatDate(timestamp);
			expect(result).toBe('2024-01-15T10:30:00.000Z');
		});
	});

	describe('isValidEmail', () => {
		it('should return true for valid email', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
			expect(isValidEmail('user.name+tag@domain.org')).toBe(true);
		});

		it('should return false for invalid email', () => {
			expect(isValidEmail('invalid')).toBe(false);
			expect(isValidEmail('missing@')).toBe(false);
			expect(isValidEmail('@nodomain.com')).toBe(false);
		});
	});

	describe('isValidUrl', () => {
		it('should return true for valid URLs', () => {
			expect(isValidUrl('https://example.com')).toBe(true);
			expect(isValidUrl('http://localhost:3000')).toBe(true);
			expect(isValidUrl('https://api.workos.com/users')).toBe(true);
		});

		it('should return false for invalid URLs', () => {
			expect(isValidUrl('not-a-url')).toBe(false);
			expect(isValidUrl('ftp://invalid.com')).toBe(false);
		});
	});

	describe('cleanEmptyProperties', () => {
		it('should remove empty strings', () => {
			const obj = { name: 'test', empty: '' };
			const result = cleanEmptyProperties(obj);
			expect(result).toEqual({ name: 'test' });
		});

		it('should remove undefined values', () => {
			const obj = { name: 'test', undef: undefined };
			const result = cleanEmptyProperties(obj);
			expect(result).toEqual({ name: 'test' });
		});

		it('should remove null values', () => {
			const obj = { name: 'test', nullVal: null };
			const result = cleanEmptyProperties(obj);
			expect(result).toEqual({ name: 'test' });
		});

		it('should keep false and 0 values', () => {
			const obj = { flag: false, count: 0, name: 'test' };
			const result = cleanEmptyProperties(obj);
			expect(result).toEqual({ flag: false, count: 0, name: 'test' });
		});

		it('should remove empty arrays', () => {
			const obj = { items: [], name: 'test' };
			const result = cleanEmptyProperties(obj);
			expect(result).toEqual({ name: 'test' });
		});
	});

	describe('parseJsonParameter', () => {
		it('should parse valid JSON string', () => {
			const json = '{"key":"value"}';
			const result = parseJsonParameter(json, 'test');
			expect(result).toEqual({ key: 'value' });
		});

		it('should return object as-is', () => {
			const obj = { key: 'value' };
			const result = parseJsonParameter(obj, 'test');
			expect(result).toEqual({ key: 'value' });
		});

		it('should throw error for invalid JSON', () => {
			expect(() => parseJsonParameter('invalid json', 'test')).toThrow();
		});

		it('should return empty object for empty string', () => {
			const result = parseJsonParameter('', 'test');
			expect(result).toEqual({});
		});
	});
});
