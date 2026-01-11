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
  const slug = this.getNodeParameter('slug', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    name,
    slug,
  };

  if (additionalFields.description) {
    body.description = additionalFields.description;
  }
  if (additionalFields.permissions) {
    body.permissions = parseJsonParameter(additionalFields.permissions, 'permissions');
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/roles',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const roleId = this.getNodeParameter('roleId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/user_management/roles/${roleId}`,
  );

  return [{ json: response }];
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const roles = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/user_management/roles',
    );
    return roles.map((role) => ({ json: role }));
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/user_management/roles',
    {},
    { limit },
  );

  return (response.data || []).map((role: any) => ({ json: role }));
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const roleId = this.getNodeParameter('roleId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.name) {
    body.name = updateFields.name;
  }
  if (updateFields.description !== undefined) {
    body.description = updateFields.description || null;
  }
  if (updateFields.permissions) {
    body.permissions = parseJsonParameter(updateFields.permissions, 'permissions');
  }

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/user_management/roles/${roleId}`,
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function deleteRole(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const roleId = this.getNodeParameter('roleId', index) as string;

  await workOsApiRequest.call(
    this,
    'DELETE',
    `/user_management/roles/${roleId}`,
  );

  return [{ json: { success: true, roleId } }];
}
