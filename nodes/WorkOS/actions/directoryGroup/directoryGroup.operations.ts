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
  const directoryGroupId = this.getNodeParameter('directoryGroupId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/directory_groups/${directoryGroupId}`,
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
  if (filters.user) {
    query.user = filters.user;
  }

  if (returnAll) {
    const groups = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/directory_groups',
      {},
      query,
    );
    return groups.map((group) => ({ json: group }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/directory_groups',
    {},
    query,
  );

  return (response.data || []).map((group: any) => ({ json: group }));
}

export async function getByDirectoryId(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const directoryId = this.getNodeParameter('directoryId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const groups = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/directory_groups',
      {},
      { directory_id: directoryId },
    );
    return groups.map((group) => ({ json: group }));
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/directory_groups',
    {},
    { directory_id: directoryId, limit },
  );

  return (response.data || []).map((group: any) => ({ json: group }));
}
