/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { workOsApiRequest, workOsApiRequestAllItems, cleanEmptyProperties, parseJsonParameter } from '../../transport/workOsApi';

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    name,
  };

  if (additionalFields.allowProfilesOutsideOrganization !== undefined) {
    body.allow_profiles_outside_organization = additionalFields.allowProfilesOutsideOrganization;
  }
  if (additionalFields.domains) {
    body.domains = parseJsonParameter(additionalFields.domains, 'domains');
  }
  if (additionalFields.domainData) {
    body.domain_data = parseJsonParameter(additionalFields.domainData, 'domainData');
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/organizations',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/organizations/${organizationId}`,
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

  if (filters.domains) {
    query.domains = filters.domains;
  }

  if (returnAll) {
    const organizations = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/organizations',
      {},
      query,
    );
    return organizations.map((org) => ({ json: org }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/organizations',
    {},
    query,
  );

  return (response.data || []).map((org: any) => ({ json: org }));
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.name) {
    body.name = updateFields.name;
  }
  if (updateFields.allowProfilesOutsideOrganization !== undefined) {
    body.allow_profiles_outside_organization = updateFields.allowProfilesOutsideOrganization;
  }
  if (updateFields.domains) {
    body.domains = parseJsonParameter(updateFields.domains, 'domains');
  }
  if (updateFields.domainData) {
    body.domain_data = parseJsonParameter(updateFields.domainData, 'domainData');
  }

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/organizations/${organizationId}`,
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function deleteOrganization(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as string;

  await workOsApiRequest.call(
    this,
    'DELETE',
    `/organizations/${organizationId}`,
  );

  return [{ json: { success: true, organizationId } }];
}
