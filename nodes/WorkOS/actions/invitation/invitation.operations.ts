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
  const email = this.getNodeParameter('email', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    email,
  };

  if (additionalFields.organizationId) {
    body.organization_id = additionalFields.organizationId;
  }
  if (additionalFields.roleSlug) {
    body.role_slug = additionalFields.roleSlug;
  }
  if (additionalFields.expiresInDays) {
    body.expires_in_days = additionalFields.expiresInDays;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/invitations',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const invitationId = this.getNodeParameter('invitationId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/user_management/invitations/${invitationId}`,
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

  if (filters.email) {
    query.email = filters.email;
  }
  if (filters.organizationId) {
    query.organization_id = filters.organizationId;
  }

  if (returnAll) {
    const invitations = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/user_management/invitations',
      {},
      query,
    );
    return invitations.map((invitation) => ({ json: invitation }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/user_management/invitations',
    {},
    query,
  );

  return (response.data || []).map((invitation: any) => ({ json: invitation }));
}

export async function revoke(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const invitationId = this.getNodeParameter('invitationId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'POST',
    `/user_management/invitations/${invitationId}/revoke`,
  );

  return [{ json: response }];
}
