/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { workOsApiRequest, workOsApiRequestAllItems, cleanEmptyProperties } from '../../transport/workOsApi';

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const url = this.getNodeParameter('url', index) as string;
  const events = this.getNodeParameter('events', index) as string[];
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    url,
    events,
  };

  if (additionalFields.secret) {
    body.secret = additionalFields.secret;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/webhooks',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/webhooks/${webhookId}`,
  );

  return [{ json: response }];
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const webhooks = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/webhooks',
    );
    return webhooks.map((webhook) => ({ json: webhook }));
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/webhooks',
    {},
    { limit },
  );

  return (response.data || []).map((webhook: any) => ({ json: webhook }));
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.url) {
    body.url = updateFields.url;
  }
  if (updateFields.events) {
    body.events = updateFields.events;
  }
  if (updateFields.secret) {
    body.secret = updateFields.secret;
  }

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/webhooks/${webhookId}`,
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function deleteWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;

  await workOsApiRequest.call(
    this,
    'DELETE',
    `/webhooks/${webhookId}`,
  );

  return [{ json: { success: true, webhookId } }];
}

export async function enable(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/webhooks/${webhookId}/enable`,
  );

  return [{ json: response }];
}

export async function disable(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/webhooks/${webhookId}/disable`,
  );

  return [{ json: response }];
}
