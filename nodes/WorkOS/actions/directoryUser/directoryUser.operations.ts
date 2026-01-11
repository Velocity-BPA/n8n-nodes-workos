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
  const directoryUserId = this.getNodeParameter('directoryUserId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/directory_users/${directoryUserId}`,
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

  if (filters.directoryId) {
    query.directory_id = filters.directoryId;
  }
  if (filters.organizationId) {
    query.organization_id = filters.organizationId;
  }
  if (filters.group) {
    query.group = filters.group;
  }

  if (returnAll) {
    const users = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/directory_users',
      {},
      query,
    );
    return users.map((user) => ({ json: user }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/directory_users',
    {},
    query,
  );

  return (response.data || []).map((user: any) => ({ json: user }));
}

export async function getByDirectoryId(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const directoryId = this.getNodeParameter('directoryId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const users = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/directory_users',
      {},
      { directory_id: directoryId },
    );
    return users.map((user) => ({ json: user }));
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/directory_users',
    {},
    { directory_id: directoryId, limit },
  );

  return (response.data || []).map((user: any) => ({ json: user }));
}
