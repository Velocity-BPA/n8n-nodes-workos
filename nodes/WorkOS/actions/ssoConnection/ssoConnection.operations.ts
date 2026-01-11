/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { workOsApiRequest, workOsApiRequestAllItems } from '../../transport/workOsApi';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const connectionId = this.getNodeParameter('connectionId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/connections/${connectionId}`,
  );

  return [{ json: response }];
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const query: IDataObject = {};

  if (filters.organizationId) {
    query.organization_id = filters.organizationId;
  }
  if (filters.connectionType) {
    query.connection_type = filters.connectionType;
  }
  if (filters.domain) {
    query.domain = filters.domain;
  }

  if (returnAll) {
    const connections = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/connections',
      {},
      query,
    );
    return connections.map((connection) => ({ json: connection }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/connections',
    {},
    query,
  );

  return (response.data || []).map((connection: any) => ({ json: connection }));
}

export async function deleteConnection(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const connectionId = this.getNodeParameter('connectionId', index) as string;

  await workOsApiRequest.call(
    this,
    'DELETE',
    `/connections/${connectionId}`,
  );

  return [{ json: { success: true, connectionId } }];
}
