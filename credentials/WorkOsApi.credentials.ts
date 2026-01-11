/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class WorkOsApi implements ICredentialType {
  name = 'workOsApi';
  displayName = 'WorkOS API';
  documentationUrl = 'https://workos.com/docs/reference';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description:
        'WorkOS API key. Starts with sk_live_ for production or sk_test_ for staging.',
      placeholder: 'sk_live_your_api_key_here',
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      description: 'WorkOS client ID (optional, required for SSO operations)',
      placeholder: 'client_xxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    {
      displayName: 'Webhook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Webhook signing secret for verifying webhook payloads (optional)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.workos.com',
      url: '/user_management/users',
      method: 'GET',
      qs: {
        limit: 1,
      },
    },
  };
}
