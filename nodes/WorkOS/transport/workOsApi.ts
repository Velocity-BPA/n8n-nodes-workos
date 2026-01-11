/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  JsonObject,
  IHttpRequestMethods,
  IRequestOptions,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { WORKOS_BASE_URL } from '../constants/constants';

export async function workOsApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<any> {
  const credentials = await this.getCredentials('workOsApi');

  const options: IRequestOptions = {
    method,
    uri: `${WORKOS_BASE_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${credentials.apiKey}`,
      'Content-Type': 'application/json',
    },
    json: true,
    qs: query,
  };

  if (Object.keys(body).length > 0 && method !== 'GET') {
    options.body = body;
  }

  try {
    const response = await this.helpers.request(options);
    return response;
  } catch (error: any) {
    if (error.response?.body) {
      const workOsError = error.response.body as JsonObject;
      throw new NodeApiError(this.getNode(), workOsError, {
        message: workOsError.message as string,
        description: `Error code: ${workOsError.code}`,
      });
    }
    throw new NodeOperationError(this.getNode(), error.message);
  }
}

export async function workOsApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<any[]> {
  const results: any[] = [];
  let after: string | undefined;
  const limit = 100;

  do {
    const response = await workOsApiRequest.call(this, method, endpoint, body, {
      ...query,
      limit,
      ...(after ? { after } : {}),
    });

    const items = response.data || [];
    results.push(...items);

    after = response.list_metadata?.after;
  } while (after);

  return results;
}

export function handleWorkOsError(
  node: any,
  error: any,
  operation: string,
  resourceType: string,
): never {
  if (error.response?.body) {
    const errorBody = error.response.body;
    const errorCode = errorBody.code || 'unknown_error';
    const errorMessage = errorBody.message || 'An unknown error occurred';

    throw new NodeApiError(node, errorBody, {
      message: `${resourceType} ${operation} failed: ${errorMessage}`,
      description: `Error code: ${errorCode}${errorBody.entity_id ? `, Entity ID: ${errorBody.entity_id}` : ''}`,
    });
  }

  throw new NodeOperationError(
    node,
    `${resourceType} ${operation} failed: ${error.message || 'Unknown error'}`,
  );
}

export function validateWorkOsId(id: string, prefix: string, fieldName: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error(`${fieldName} is required`);
  }
  if (!id.startsWith(`${prefix}_`)) {
    throw new Error(`${fieldName} must start with '${prefix}_'`);
  }
}

export function cleanEmptyProperties(obj: IDataObject): IDataObject {
  const cleaned: IDataObject = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nestedCleaned = cleanEmptyProperties(value as IDataObject);
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

export function parseJsonParameter(value: any, parameterName: string): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Invalid JSON in ${parameterName} parameter`);
    }
  }
  return value;
}
