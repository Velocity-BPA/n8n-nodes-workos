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
  const directoryId = this.getNodeParameter('directoryId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/directories/${directoryId}`,
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
  if (filters.domain) {
    query.domain = filters.domain;
  }
  if (filters.search) {
    query.search = filters.search;
  }

  if (returnAll) {
    const directories = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/directories',
      {},
      query,
    );
    return directories.map((directory) => ({ json: directory }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/directories',
    {},
    query,
  );

  return (response.data || []).map((directory: any) => ({ json: directory }));
}

export async function deleteDirectory(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const directoryId = this.getNodeParameter('directoryId', index) as string;

  await workOsApiRequest.call(
    this,
    'DELETE',
    `/directories/${directoryId}`,
  );

  return [{ json: { success: true, directoryId } }];
}
