/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import type { IDataObject } from 'n8n-workflow';

/**
 * Verify WorkOS webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  tolerance: number = 300, // 5 minutes
): boolean {
  try {
    // Parse the signature header
    const parts = signature.split(',');
    const signatureParts: { [key: string]: string } = {};
    
    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key && value) {
        signatureParts[key.trim()] = value.trim();
      }
    }

    const timestamp = signatureParts['t'];
    const sig = signatureParts['v1'];

    if (!timestamp || !sig) {
      return false;
    }

    // Check timestamp tolerance
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp, 10);
    
    if (Math.abs(currentTime - webhookTime) > tolerance) {
      return false;
    }

    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    // Constant-time comparison
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const actualBuffer = Buffer.from(sig, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  } catch {
    return false;
  }
}

/**
 * Format date for API - handles Date objects, strings, and timestamps
 */
export function formatDate(date: Date | string | number): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'number') {
    return new Date(date).toISOString();
  }
  // Return string dates as-is if they're already formatted
  if (typeof date === 'string' && !date.includes('T')) {
    return date;
  }
  return new Date(date).toISOString();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

/**
 * Remove empty, null, and undefined properties from an object
 */
export function cleanEmptyProperties(obj: IDataObject): IDataObject {
  const result: IDataObject = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }
    result[key] = value;
  }
  
  return result;
}

/**
 * Parse JSON parameter - handles strings and objects
 */
export function parseJsonParameter(value: string | IDataObject, fieldName: string): IDataObject {
  if (typeof value === 'object') {
    return value;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return {};
  }
  try {
    return JSON.parse(value) as IDataObject;
  } catch (error) {
    throw new Error(`Invalid JSON in ${fieldName}: ${(error as Error).message}`);
  }
}

/**
 * Build query parameters for filtering
 */
export function buildFilterQuery(filters: IDataObject): IDataObject {
  const query: IDataObject = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        query[key] = value.join(',');
      } else if (!Array.isArray(value)) {
        query[key] = value;
      }
    }
  }

  return query;
}

/**
 * Parse WorkOS pagination metadata
 */
export function parsePaginationMetadata(response: any): {
  hasMore: boolean;
  beforeCursor: string | null;
  afterCursor: string | null;
} {
  const metadata = response.list_metadata || {};
  return {
    hasMore: !!metadata.after,
    beforeCursor: metadata.before || null,
    afterCursor: metadata.after || null,
  };
}

/**
 * Format user display name
 */
export function formatUserDisplayName(user: {
  first_name?: string | null;
  last_name?: string | null;
  email: string;
}): string {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name) {
    return user.first_name;
  }
  if (user.last_name) {
    return user.last_name;
  }
  return user.email;
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.response?.statusCode === 429 && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      
      throw error;
    }
  }

  throw lastError;
}
