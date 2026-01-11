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
  const userId = this.getNodeParameter('userId', index) as string;
  const organizationId = this.getNodeParameter('organizationId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    user_id: userId,
    organization_id: organizationId,
  };

  if (additionalFields.roleSlug) {
    body.role_slug = additionalFields.roleSlug;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/organization_memberships',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const membershipId = this.getNodeParameter('membershipId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/user_management/organization_memberships/${membershipId}`,
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

  if (filters.userId) {
    query.user_id = filters.userId;
  }
  if (filters.organizationId) {
    query.organization_id = filters.organizationId;
  }
  if (filters.statuses) {
    query.statuses = (filters.statuses as string[]).join(',');
  }

  if (returnAll) {
    const memberships = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/user_management/organization_memberships',
      {},
      query,
    );
    return memberships.map((membership) => ({ json: membership }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/user_management/organization_memberships',
    {},
    query,
  );

  return (response.data || []).map((membership: any) => ({ json: membership }));
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const membershipId = this.getNodeParameter('membershipId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.roleSlug) {
    body.role_slug = updateFields.roleSlug;
  }

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/user_management/organization_memberships/${membershipId}`,
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function deleteMembership(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const membershipId = this.getNodeParameter('membershipId', index) as string;

  await workOsApiRequest.call(
    this,
    'DELETE',
    `/user_management/organization_memberships/${membershipId}`,
  );

  return [{ json: { success: true, membershipId } }];
}

export async function deactivate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const membershipId = this.getNodeParameter('membershipId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/user_management/organization_memberships/${membershipId}/deactivate`,
  );

  return [{ json: response }];
}
