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
  const email = this.getNodeParameter('email', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    email,
  };

  if (additionalFields.password) {
    body.password = additionalFields.password;
  }
  if (additionalFields.passwordHash) {
    body.password_hash = additionalFields.passwordHash;
  }
  if (additionalFields.passwordHashType) {
    body.password_hash_type = additionalFields.passwordHashType;
  }
  if (additionalFields.firstName) {
    body.first_name = additionalFields.firstName;
  }
  if (additionalFields.lastName) {
    body.last_name = additionalFields.lastName;
  }
  if (additionalFields.emailVerified !== undefined) {
    body.email_verified = additionalFields.emailVerified;
  }
  if (additionalFields.profilePictureUrl) {
    body.profile_picture_url = additionalFields.profilePictureUrl;
  }
  if (additionalFields.metadata) {
    body.metadata = parseJsonParameter(additionalFields.metadata, 'metadata');
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/users',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/user_management/users/${userId}`,
  );

  return [{ json: response }];
}

export async function getByEmail(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const email = this.getNodeParameter('email', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/user_management/users',
    {},
    { email },
  );

  const users = response.data || [];
  if (users.length === 0) {
    return [{ json: { message: 'User not found', email } }];
  }

  return [{ json: users[0] }];
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
    const users = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/user_management/users',
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
    '/user_management/users',
    {},
    query,
  );

  return (response.data || []).map((user: any) => ({ json: user }));
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.firstName !== undefined) {
    body.first_name = updateFields.firstName;
  }
  if (updateFields.lastName !== undefined) {
    body.last_name = updateFields.lastName;
  }
  if (updateFields.emailVerified !== undefined) {
    body.email_verified = updateFields.emailVerified;
  }
  if (updateFields.password) {
    body.password = updateFields.password;
  }
  if (updateFields.passwordHash) {
    body.password_hash = updateFields.passwordHash;
  }
  if (updateFields.passwordHashType) {
    body.password_hash_type = updateFields.passwordHashType;
  }
  if (updateFields.profilePictureUrl !== undefined) {
    body.profile_picture_url = updateFields.profilePictureUrl || null;
  }
  if (updateFields.metadata) {
    body.metadata = parseJsonParameter(updateFields.metadata, 'metadata');
  }

  const response = await workOsApiRequest.call(
    this,
    'PUT',
    `/user_management/users/${userId}`,
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}

export async function deleteUser(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;

  await workOsApiRequest.call(
    this,
    'DELETE',
    `/user_management/users/${userId}`,
  );

  return [{ json: { success: true, userId } }];
}

export async function getOrganizationMemberships(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  if (returnAll) {
    const memberships = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/user_management/organization_memberships',
      {},
      { user_id: userId },
    );
    return memberships.map((membership) => ({ json: membership }));
  }

  const limit = this.getNodeParameter('limit', index) as number;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/user_management/organization_memberships',
    {},
    { user_id: userId, limit },
  );

  return (response.data || []).map((membership: any) => ({ json: membership }));
}

export async function sendMagicAuth(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const email = this.getNodeParameter('email', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = { email };

  if (additionalFields.invitationToken) {
    body.invitation_token = additionalFields.invitationToken;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/magic_auth/send',
    body,
  );

  return [{ json: response }];
}

export async function sendPasswordReset(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const email = this.getNodeParameter('email', index) as string;
  const passwordResetUrl = this.getNodeParameter('passwordResetUrl', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/password_reset/send',
    {
      email,
      password_reset_url: passwordResetUrl,
    },
  );

  return [{ json: response }];
}

export async function verifyEmail(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const userId = this.getNodeParameter('userId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'POST',
    `/user_management/users/${userId}/email_verification/send`,
  );

  return [{ json: response }];
}

export async function authenticateWithPassword(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const credentials = await this.getCredentials('workOsApi');
  const email = this.getNodeParameter('email', index) as string;
  const password = this.getNodeParameter('password', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    client_id: credentials.clientId,
    email,
    password,
    grant_type: 'password',
  };

  if (additionalFields.ipAddress) {
    body.ip_address = additionalFields.ipAddress;
  }
  if (additionalFields.userAgent) {
    body.user_agent = additionalFields.userAgent;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/authenticate',
    body,
  );

  return [{ json: response }];
}

export async function authenticateWithCode(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const credentials = await this.getCredentials('workOsApi');
  const code = this.getNodeParameter('code', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    client_id: credentials.clientId,
    code,
    grant_type: 'authorization_code',
  };

  if (additionalFields.ipAddress) {
    body.ip_address = additionalFields.ipAddress;
  }
  if (additionalFields.userAgent) {
    body.user_agent = additionalFields.userAgent;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/authenticate',
    body,
  );

  return [{ json: response }];
}

export async function authenticateWithMagicAuth(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const credentials = await this.getCredentials('workOsApi');
  const code = this.getNodeParameter('code', index) as string;
  const email = this.getNodeParameter('email', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    client_id: credentials.clientId,
    code,
    email,
    grant_type: 'urn:workos:oauth:grant-type:magic-auth:code',
  };

  if (additionalFields.ipAddress) {
    body.ip_address = additionalFields.ipAddress;
  }
  if (additionalFields.userAgent) {
    body.user_agent = additionalFields.userAgent;
  }
  if (additionalFields.invitationToken) {
    body.invitation_token = additionalFields.invitationToken;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/authenticate',
    body,
  );

  return [{ json: response }];
}

export async function authenticateWithTotp(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const credentials = await this.getCredentials('workOsApi');
  const code = this.getNodeParameter('code', index) as string;
  const authenticationChallengeId = this.getNodeParameter('authenticationChallengeId', index) as string;
  const pendingAuthenticationToken = this.getNodeParameter('pendingAuthenticationToken', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    client_id: credentials.clientId,
    code,
    authentication_challenge_id: authenticationChallengeId,
    pending_authentication_token: pendingAuthenticationToken,
    grant_type: 'urn:workos:oauth:grant-type:mfa-totp',
  };

  if (additionalFields.ipAddress) {
    body.ip_address = additionalFields.ipAddress;
  }
  if (additionalFields.userAgent) {
    body.user_agent = additionalFields.userAgent;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/user_management/authenticate',
    body,
  );

  return [{ json: response }];
}
