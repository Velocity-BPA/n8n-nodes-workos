/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as user from './actions/user/user.operations';
import * as organization from './actions/organization/organization.operations';
import * as organizationMembership from './actions/organizationMembership/organizationMembership.operations';
import * as ssoConnection from './actions/ssoConnection/ssoConnection.operations';
import * as directory from './actions/directory/directory.operations';
import * as directoryUser from './actions/directoryUser/directoryUser.operations';
import * as directoryGroup from './actions/directoryGroup/directoryGroup.operations';
import * as portalLink from './actions/portalLink/portalLink.operations';
import * as auditLog from './actions/auditLog/auditLog.operations';
import * as webhook from './actions/webhook/webhook.operations';
import * as role from './actions/role/role.operations';
import * as invitation from './actions/invitation/invitation.operations';

import {
  CONNECTION_TYPES,
  PORTAL_INTENTS,
  PASSWORD_HASH_TYPES,
  MEMBERSHIP_STATUSES,
  WEBHOOK_EVENTS,
  LICENSING_NOTICE,
} from './constants/constants';

// Log licensing notice once on module load
console.warn(LICENSING_NOTICE);

export class WorkOS implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WorkOS',
    name: 'workOs',
    icon: 'file:workos.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Integrate with WorkOS for SSO, Directory Sync, and user management',
    defaults: {
      name: 'WorkOS',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'workOsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Audit Log', value: 'auditLog' },
          { name: 'Directory', value: 'directory' },
          { name: 'Directory Group', value: 'directoryGroup' },
          { name: 'Directory User', value: 'directoryUser' },
          { name: 'Invitation', value: 'invitation' },
          { name: 'Organization', value: 'organization' },
          { name: 'Organization Membership', value: 'organizationMembership' },
          { name: 'Portal Link', value: 'portalLink' },
          { name: 'Role', value: 'role' },
          { name: 'SSO Connection', value: 'ssoConnection' },
          { name: 'User', value: 'user' },
          { name: 'Webhook', value: 'webhook' },
        ],
        default: 'user',
      },

      // ========== USER OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['user'],
          },
        },
        options: [
          { name: 'Authenticate with Code', value: 'authenticateWithCode', action: 'Authenticate with auth code', description: 'Authenticate user with authorization code' },
          { name: 'Authenticate with Magic Auth', value: 'authenticateWithMagicAuth', action: 'Authenticate with magic link', description: 'Authenticate user with magic link code' },
          { name: 'Authenticate with Password', value: 'authenticateWithPassword', action: 'Authenticate with password', description: 'Authenticate user with email and password' },
          { name: 'Authenticate with TOTP', value: 'authenticateWithTotp', action: 'Authenticate with TOTP', description: 'Authenticate user with TOTP code' },
          { name: 'Create', value: 'create', action: 'Create a user', description: 'Create a new user' },
          { name: 'Delete', value: 'delete', action: 'Delete a user', description: 'Permanently delete a user' },
          { name: 'Get', value: 'get', action: 'Get a user', description: 'Get user by ID' },
          { name: 'Get by Email', value: 'getByEmail', action: 'Get user by email', description: 'Find user by email address' },
          { name: 'Get Many', value: 'getAll', action: 'Get many users', description: 'List all users' },
          { name: 'Get Organization Memberships', value: 'getOrganizationMemberships', action: 'Get organization memberships', description: "List user's organizations" },
          { name: 'Send Magic Auth', value: 'sendMagicAuth', action: 'Send magic auth email', description: 'Send magic link email to user' },
          { name: 'Send Password Reset', value: 'sendPasswordReset', action: 'Send password reset email', description: 'Send password reset email to user' },
          { name: 'Update', value: 'update', action: 'Update a user', description: 'Update user properties' },
          { name: 'Verify Email', value: 'verifyEmail', action: 'Send verification email', description: 'Send email verification to user' },
        ],
        default: 'create',
      },

      // ========== ORGANIZATION OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['organization'],
          },
        },
        options: [
          { name: 'Create', value: 'create', action: 'Create an organization', description: 'Create a new organization' },
          { name: 'Delete', value: 'delete', action: 'Delete an organization', description: 'Remove an organization' },
          { name: 'Get', value: 'get', action: 'Get an organization', description: 'Get organization by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many organizations', description: 'List all organizations' },
          { name: 'Update', value: 'update', action: 'Update an organization', description: 'Update organization settings' },
        ],
        default: 'create',
      },

      // ========== ORGANIZATION MEMBERSHIP OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['organizationMembership'],
          },
        },
        options: [
          { name: 'Create', value: 'create', action: 'Create a membership', description: 'Add user to organization' },
          { name: 'Deactivate', value: 'deactivate', action: 'Deactivate a membership', description: 'Deactivate membership' },
          { name: 'Delete', value: 'delete', action: 'Delete a membership', description: 'Remove membership' },
          { name: 'Get', value: 'get', action: 'Get a membership', description: 'Get membership by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many memberships', description: 'List memberships' },
          { name: 'Update', value: 'update', action: 'Update a membership', description: 'Update membership' },
        ],
        default: 'create',
      },

      // ========== SSO CONNECTION OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['ssoConnection'],
          },
        },
        options: [
          { name: 'Delete', value: 'delete', action: 'Delete a connection', description: 'Remove SSO connection' },
          { name: 'Get', value: 'get', action: 'Get a connection', description: 'Get connection by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many connections', description: 'List all connections' },
        ],
        default: 'get',
      },

      // ========== DIRECTORY OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['directory'],
          },
        },
        options: [
          { name: 'Delete', value: 'delete', action: 'Delete a directory', description: 'Remove directory' },
          { name: 'Get', value: 'get', action: 'Get a directory', description: 'Get directory by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many directories', description: 'List all directories' },
        ],
        default: 'get',
      },

      // ========== DIRECTORY USER OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['directoryUser'],
          },
        },
        options: [
          { name: 'Get', value: 'get', action: 'Get a directory user', description: 'Get directory user by ID' },
          { name: 'Get by Directory', value: 'getByDirectoryId', action: 'Get users by directory', description: 'List users in directory' },
          { name: 'Get Many', value: 'getAll', action: 'Get many directory users', description: 'List directory users' },
        ],
        default: 'get',
      },

      // ========== DIRECTORY GROUP OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['directoryGroup'],
          },
        },
        options: [
          { name: 'Get', value: 'get', action: 'Get a directory group', description: 'Get directory group by ID' },
          { name: 'Get by Directory', value: 'getByDirectoryId', action: 'Get groups by directory', description: 'List groups in directory' },
          { name: 'Get Many', value: 'getAll', action: 'Get many directory groups', description: 'List directory groups' },
        ],
        default: 'get',
      },

      // ========== PORTAL LINK OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['portalLink'],
          },
        },
        options: [
          { name: 'Generate', value: 'generate', action: 'Generate portal link', description: 'Generate Admin Portal link' },
        ],
        default: 'generate',
      },

      // ========== AUDIT LOG OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['auditLog'],
          },
        },
        options: [
          { name: 'Create Export', value: 'createExport', action: 'Create event export', description: 'Create audit log event export' },
          { name: 'Get', value: 'get', action: 'Get an event', description: 'Get event by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many events', description: 'List audit log events' },
        ],
        default: 'getAll',
      },

      // ========== WEBHOOK OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
          },
        },
        options: [
          { name: 'Create', value: 'create', action: 'Create a webhook', description: 'Create webhook endpoint' },
          { name: 'Delete', value: 'delete', action: 'Delete a webhook', description: 'Remove webhook' },
          { name: 'Disable', value: 'disable', action: 'Disable a webhook', description: 'Disable webhook' },
          { name: 'Enable', value: 'enable', action: 'Enable a webhook', description: 'Enable webhook' },
          { name: 'Get', value: 'get', action: 'Get a webhook', description: 'Get webhook by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many webhooks', description: 'List all webhooks' },
          { name: 'Update', value: 'update', action: 'Update a webhook', description: 'Update webhook settings' },
        ],
        default: 'create',
      },

      // ========== ROLE OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['role'],
          },
        },
        options: [
          { name: 'Create', value: 'create', action: 'Create a role', description: 'Create custom role' },
          { name: 'Delete', value: 'delete', action: 'Delete a role', description: 'Remove role' },
          { name: 'Get', value: 'get', action: 'Get a role', description: 'Get role by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many roles', description: 'List all roles' },
          { name: 'Update', value: 'update', action: 'Update a role', description: 'Update role' },
        ],
        default: 'create',
      },

      // ========== INVITATION OPERATIONS ==========
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['invitation'],
          },
        },
        options: [
          { name: 'Create', value: 'create', action: 'Create an invitation', description: 'Create user invitation' },
          { name: 'Get', value: 'get', action: 'Get an invitation', description: 'Get invitation by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many invitations', description: 'List invitations' },
          { name: 'Revoke', value: 'revoke', action: 'Revoke an invitation', description: 'Revoke invitation' },
        ],
        default: 'create',
      },

      // ========== USER PARAMETERS ==========
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['get', 'update', 'delete', 'getOrganizationMemberships', 'verifyEmail'],
          },
        },
        default: '',
        placeholder: 'user_01HXXXXXXXXXXXXXXXXXXXXXX',
        description: 'The ID of the user',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['create', 'getByEmail', 'sendMagicAuth', 'sendPasswordReset', 'authenticateWithPassword', 'authenticateWithMagicAuth'],
          },
        },
        default: '',
        placeholder: 'user@example.com',
        description: 'The email address of the user',
      },
      {
        displayName: 'Password',
        name: 'password',
        type: 'string',
        typeOptions: { password: true },
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['authenticateWithPassword'],
          },
        },
        default: '',
        description: 'The user password',
      },
      {
        displayName: 'Password Reset URL',
        name: 'passwordResetUrl',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['sendPasswordReset'],
          },
        },
        default: '',
        placeholder: 'https://example.com/reset-password',
        description: 'The URL to redirect to for password reset',
      },
      {
        displayName: 'Code',
        name: 'code',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['authenticateWithCode', 'authenticateWithMagicAuth', 'authenticateWithTotp'],
          },
        },
        default: '',
        description: 'The authentication code',
      },
      {
        displayName: 'Authentication Challenge ID',
        name: 'authenticationChallengeId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['authenticateWithTotp'],
          },
        },
        default: '',
        description: 'The authentication challenge ID for TOTP',
      },
      {
        displayName: 'Pending Authentication Token',
        name: 'pendingAuthenticationToken',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['authenticateWithTotp'],
          },
        },
        default: '',
        description: 'The pending authentication token',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Email Verified',
            name: 'emailVerified',
            type: 'boolean',
            default: false,
            description: 'Whether the email is verified',
          },
          {
            displayName: 'First Name',
            name: 'firstName',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Last Name',
            name: 'lastName',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Metadata',
            name: 'metadata',
            type: 'json',
            default: '{}',
            description: 'Custom metadata as JSON',
          },
          {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
          },
          {
            displayName: 'Password Hash',
            name: 'passwordHash',
            type: 'string',
            default: '',
            description: 'Pre-hashed password',
          },
          {
            displayName: 'Password Hash Type',
            name: 'passwordHashType',
            type: 'options',
            options: PASSWORD_HASH_TYPES,
            default: 'bcrypt',
          },
          {
            displayName: 'Profile Picture URL',
            name: 'profilePictureUrl',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['update'],
          },
        },
        options: [
          {
            displayName: 'Email Verified',
            name: 'emailVerified',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'First Name',
            name: 'firstName',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Last Name',
            name: 'lastName',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Metadata',
            name: 'metadata',
            type: 'json',
            default: '{}',
          },
          {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
          },
          {
            displayName: 'Password Hash',
            name: 'passwordHash',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Password Hash Type',
            name: 'passwordHashType',
            type: 'options',
            options: PASSWORD_HASH_TYPES,
            default: 'bcrypt',
          },
          {
            displayName: 'Profile Picture URL',
            name: 'profilePictureUrl',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['sendMagicAuth', 'authenticateWithPassword', 'authenticateWithCode', 'authenticateWithMagicAuth', 'authenticateWithTotp'],
          },
        },
        options: [
          {
            displayName: 'Invitation Token',
            name: 'invitationToken',
            type: 'string',
            default: '',
            displayOptions: {
              show: {
                '/operation': ['sendMagicAuth', 'authenticateWithMagicAuth'],
              },
            },
          },
          {
            displayName: 'IP Address',
            name: 'ipAddress',
            type: 'string',
            default: '',
          },
          {
            displayName: 'User Agent',
            name: 'userAgent',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== ORGANIZATION PARAMETERS ==========
      {
        displayName: 'Organization ID',
        name: 'organizationId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['get', 'update', 'delete'],
          },
        },
        default: '',
        placeholder: 'org_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['create'],
          },
        },
        default: '',
        description: 'The name of the organization',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Allow Profiles Outside Organization',
            name: 'allowProfilesOutsideOrganization',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Domain Data',
            name: 'domainData',
            type: 'json',
            default: '[]',
            description: 'Domain verification data as JSON array',
          },
          {
            displayName: 'Domains',
            name: 'domains',
            type: 'json',
            default: '[]',
            description: 'Verified domain names as JSON array',
          },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['update'],
          },
        },
        options: [
          {
            displayName: 'Allow Profiles Outside Organization',
            name: 'allowProfilesOutsideOrganization',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Domain Data',
            name: 'domainData',
            type: 'json',
            default: '[]',
          },
          {
            displayName: 'Domains',
            name: 'domains',
            type: 'json',
            default: '[]',
          },
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['organization'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Domains',
            name: 'domains',
            type: 'string',
            default: '',
            description: 'Filter by domain name',
          },
        ],
      },

      // ========== ORGANIZATION MEMBERSHIP PARAMETERS ==========
      {
        displayName: 'Membership ID',
        name: 'membershipId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['organizationMembership'],
            operation: ['get', 'update', 'delete', 'deactivate'],
          },
        },
        default: '',
        placeholder: 'om_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['organizationMembership'],
            operation: ['create'],
          },
        },
        default: '',
        placeholder: 'user_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Organization ID',
        name: 'organizationId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['organizationMembership'],
            operation: ['create'],
          },
        },
        default: '',
        placeholder: 'org_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['organizationMembership'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Role Slug',
            name: 'roleSlug',
            type: 'string',
            default: '',
            description: 'The role identifier for the membership',
          },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['organizationMembership'],
            operation: ['update'],
          },
        },
        options: [
          {
            displayName: 'Role Slug',
            name: 'roleSlug',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['organizationMembership'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Statuses',
            name: 'statuses',
            type: 'multiOptions',
            options: MEMBERSHIP_STATUSES,
            default: [],
          },
          {
            displayName: 'User ID',
            name: 'userId',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== SSO CONNECTION PARAMETERS ==========
      {
        displayName: 'Connection ID',
        name: 'connectionId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['ssoConnection'],
            operation: ['get', 'delete'],
          },
        },
        default: '',
        placeholder: 'conn_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['ssoConnection'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Connection Type',
            name: 'connectionType',
            type: 'options',
            options: CONNECTION_TYPES,
            default: '',
          },
          {
            displayName: 'Domain',
            name: 'domain',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== DIRECTORY PARAMETERS ==========
      {
        displayName: 'Directory ID',
        name: 'directoryId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['directory'],
            operation: ['get', 'delete'],
          },
        },
        default: '',
        placeholder: 'directory_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['directory'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Domain',
            name: 'domain',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Search',
            name: 'search',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== DIRECTORY USER PARAMETERS ==========
      {
        displayName: 'Directory User ID',
        name: 'directoryUserId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['directoryUser'],
            operation: ['get'],
          },
        },
        default: '',
        placeholder: 'directory_user_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Directory ID',
        name: 'directoryId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['directoryUser'],
            operation: ['getByDirectoryId'],
          },
        },
        default: '',
        placeholder: 'directory_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['directoryUser'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Directory ID',
            name: 'directoryId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Group',
            name: 'group',
            type: 'string',
            default: '',
            description: 'Filter by group ID',
          },
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== DIRECTORY GROUP PARAMETERS ==========
      {
        displayName: 'Directory Group ID',
        name: 'directoryGroupId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['directoryGroup'],
            operation: ['get'],
          },
        },
        default: '',
        placeholder: 'directory_group_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Directory ID',
        name: 'directoryId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['directoryGroup'],
            operation: ['getByDirectoryId'],
          },
        },
        default: '',
        placeholder: 'directory_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['directoryGroup'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Directory ID',
            name: 'directoryId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: '',
            description: 'Filter by user ID',
          },
        ],
      },

      // ========== PORTAL LINK PARAMETERS ==========
      {
        displayName: 'Organization ID',
        name: 'organizationId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['portalLink'],
            operation: ['generate'],
          },
        },
        default: '',
        placeholder: 'org_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Intent',
        name: 'intent',
        type: 'options',
        options: PORTAL_INTENTS,
        required: true,
        displayOptions: {
          show: {
            resource: ['portalLink'],
            operation: ['generate'],
          },
        },
        default: 'sso',
        description: 'The portal intent',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['portalLink'],
            operation: ['generate'],
          },
        },
        options: [
          {
            displayName: 'Return URL',
            name: 'returnUrl',
            type: 'string',
            default: '',
            description: 'URL to redirect after portal session',
          },
          {
            displayName: 'Success URL',
            name: 'successUrl',
            type: 'string',
            default: '',
            description: 'URL to redirect on success',
          },
        ],
      },

      // ========== AUDIT LOG PARAMETERS ==========
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['auditLog'],
            operation: ['get'],
          },
        },
        default: '',
      },
      {
        displayName: 'Organization ID',
        name: 'organizationId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['auditLog'],
            operation: ['getAll', 'createExport'],
          },
        },
        default: '',
        placeholder: 'org_01HXXXXXXXXXXXXXXXXXXXXXX',
      },
      {
        displayName: 'Range Start',
        name: 'rangeStart',
        type: 'dateTime',
        required: true,
        displayOptions: {
          show: {
            resource: ['auditLog'],
            operation: ['createExport'],
          },
        },
        default: '',
        description: 'Start of the export range',
      },
      {
        displayName: 'Range End',
        name: 'rangeEnd',
        type: 'dateTime',
        required: true,
        displayOptions: {
          show: {
            resource: ['auditLog'],
            operation: ['createExport'],
          },
        },
        default: '',
        description: 'End of the export range',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['auditLog'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Actions',
            name: 'actions',
            type: 'string',
            typeOptions: {
              multipleValues: true,
            },
            default: [],
            description: 'Filter by action types',
          },
          {
            displayName: 'Actor IDs',
            name: 'actorIds',
            type: 'string',
            typeOptions: {
              multipleValues: true,
            },
            default: [],
          },
          {
            displayName: 'Actor Names',
            name: 'actorNames',
            type: 'string',
            typeOptions: {
              multipleValues: true,
            },
            default: [],
          },
          {
            displayName: 'Range End',
            name: 'rangeEnd',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Range Start',
            name: 'rangeStart',
            type: 'dateTime',
            default: '',
          },
          {
            displayName: 'Targets',
            name: 'targets',
            type: 'json',
            default: '[]',
            description: 'Filter by target types as JSON array',
          },
        ],
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['auditLog'],
            operation: ['createExport'],
          },
        },
        options: [
          {
            displayName: 'Actions',
            name: 'actions',
            type: 'string',
            typeOptions: {
              multipleValues: true,
            },
            default: [],
          },
          {
            displayName: 'Actor IDs',
            name: 'actorIds',
            type: 'string',
            typeOptions: {
              multipleValues: true,
            },
            default: [],
          },
          {
            displayName: 'Actor Names',
            name: 'actorNames',
            type: 'string',
            typeOptions: {
              multipleValues: true,
            },
            default: [],
          },
          {
            displayName: 'Targets',
            name: 'targets',
            type: 'json',
            default: '[]',
          },
        ],
      },

      // ========== WEBHOOK PARAMETERS ==========
      {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['get', 'update', 'delete', 'enable', 'disable'],
          },
        },
        default: '',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['create'],
          },
        },
        default: '',
        placeholder: 'https://example.com/webhook',
        description: 'The endpoint URL for the webhook',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: WEBHOOK_EVENTS,
        required: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['create'],
          },
        },
        default: [],
        description: 'Events to subscribe to',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Secret',
            name: 'secret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Webhook signing secret',
          },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['update'],
          },
        },
        options: [
          {
            displayName: 'Events',
            name: 'events',
            type: 'multiOptions',
            options: WEBHOOK_EVENTS,
            default: [],
          },
          {
            displayName: 'Secret',
            name: 'secret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
          },
          {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== ROLE PARAMETERS ==========
      {
        displayName: 'Role ID',
        name: 'roleId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['role'],
            operation: ['get', 'update', 'delete'],
          },
        },
        default: '',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['role'],
            operation: ['create'],
          },
        },
        default: '',
        description: 'The display name of the role',
      },
      {
        displayName: 'Slug',
        name: 'slug',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['role'],
            operation: ['create'],
          },
        },
        default: '',
        description: 'The unique identifier for the role',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['role'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Permissions',
            name: 'permissions',
            type: 'json',
            default: '[]',
            description: 'Array of permissions as JSON',
          },
        ],
      },
      {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['role'],
            operation: ['update'],
          },
        },
        options: [
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Permissions',
            name: 'permissions',
            type: 'json',
            default: '[]',
          },
        ],
      },

      // ========== INVITATION PARAMETERS ==========
      {
        displayName: 'Invitation ID',
        name: 'invitationId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['invitation'],
            operation: ['get', 'revoke'],
          },
        },
        default: '',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['invitation'],
            operation: ['create'],
          },
        },
        default: '',
        placeholder: 'user@example.com',
        description: 'Email address of the invitee',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            resource: ['invitation'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Expires in Days',
            name: 'expiresInDays',
            type: 'number',
            default: 7,
            description: 'Number of days until invitation expires',
          },
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Role Slug',
            name: 'roleSlug',
            type: 'string',
            default: '',
          },
        ],
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['invitation'],
            operation: ['getAll'],
          },
        },
        options: [
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Organization ID',
            name: 'organizationId',
            type: 'string',
            default: '',
          },
        ],
      },

      // ========== COMMON PAGINATION PARAMETERS ==========
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['user', 'organization', 'organizationMembership', 'ssoConnection', 'directory', 'directoryUser', 'directoryGroup', 'auditLog', 'webhook', 'role', 'invitation'],
            operation: ['getAll', 'getOrganizationMemberships', 'getByDirectoryId'],
          },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
          show: {
            resource: ['user', 'organization', 'organizationMembership', 'ssoConnection', 'directory', 'directoryUser', 'directoryGroup', 'auditLog', 'webhook', 'role', 'invitation'],
            operation: ['getAll', 'getOrganizationMemberships', 'getByDirectoryId'],
            returnAll: [false],
          },
        },
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 50,
        description: 'Max number of results to return',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: INodeExecutionData[] = [];

        switch (resource) {
          case 'user':
            switch (operation) {
              case 'create':
                responseData = await user.create.call(this, i);
                break;
              case 'get':
                responseData = await user.get.call(this, i);
                break;
              case 'getByEmail':
                responseData = await user.getByEmail.call(this, i);
                break;
              case 'getAll':
                responseData = await user.getAll.call(this, i);
                break;
              case 'update':
                responseData = await user.update.call(this, i);
                break;
              case 'delete':
                responseData = await user.deleteUser.call(this, i);
                break;
              case 'getOrganizationMemberships':
                responseData = await user.getOrganizationMemberships.call(this, i);
                break;
              case 'sendMagicAuth':
                responseData = await user.sendMagicAuth.call(this, i);
                break;
              case 'sendPasswordReset':
                responseData = await user.sendPasswordReset.call(this, i);
                break;
              case 'verifyEmail':
                responseData = await user.verifyEmail.call(this, i);
                break;
              case 'authenticateWithPassword':
                responseData = await user.authenticateWithPassword.call(this, i);
                break;
              case 'authenticateWithCode':
                responseData = await user.authenticateWithCode.call(this, i);
                break;
              case 'authenticateWithMagicAuth':
                responseData = await user.authenticateWithMagicAuth.call(this, i);
                break;
              case 'authenticateWithTotp':
                responseData = await user.authenticateWithTotp.call(this, i);
                break;
            }
            break;

          case 'organization':
            switch (operation) {
              case 'create':
                responseData = await organization.create.call(this, i);
                break;
              case 'get':
                responseData = await organization.get.call(this, i);
                break;
              case 'getAll':
                responseData = await organization.getAll.call(this, i);
                break;
              case 'update':
                responseData = await organization.update.call(this, i);
                break;
              case 'delete':
                responseData = await organization.deleteOrganization.call(this, i);
                break;
            }
            break;

          case 'organizationMembership':
            switch (operation) {
              case 'create':
                responseData = await organizationMembership.create.call(this, i);
                break;
              case 'get':
                responseData = await organizationMembership.get.call(this, i);
                break;
              case 'getAll':
                responseData = await organizationMembership.getAll.call(this, i);
                break;
              case 'update':
                responseData = await organizationMembership.update.call(this, i);
                break;
              case 'delete':
                responseData = await organizationMembership.deleteMembership.call(this, i);
                break;
              case 'deactivate':
                responseData = await organizationMembership.deactivate.call(this, i);
                break;
            }
            break;

          case 'ssoConnection':
            switch (operation) {
              case 'get':
                responseData = await ssoConnection.get.call(this, i);
                break;
              case 'getAll':
                responseData = await ssoConnection.getAll.call(this, i);
                break;
              case 'delete':
                responseData = await ssoConnection.deleteConnection.call(this, i);
                break;
            }
            break;

          case 'directory':
            switch (operation) {
              case 'get':
                responseData = await directory.get.call(this, i);
                break;
              case 'getAll':
                responseData = await directory.getAll.call(this, i);
                break;
              case 'delete':
                responseData = await directory.deleteDirectory.call(this, i);
                break;
            }
            break;

          case 'directoryUser':
            switch (operation) {
              case 'get':
                responseData = await directoryUser.get.call(this, i);
                break;
              case 'getAll':
                responseData = await directoryUser.getAll.call(this, i);
                break;
              case 'getByDirectoryId':
                responseData = await directoryUser.getByDirectoryId.call(this, i);
                break;
            }
            break;

          case 'directoryGroup':
            switch (operation) {
              case 'get':
                responseData = await directoryGroup.get.call(this, i);
                break;
              case 'getAll':
                responseData = await directoryGroup.getAll.call(this, i);
                break;
              case 'getByDirectoryId':
                responseData = await directoryGroup.getByDirectoryId.call(this, i);
                break;
            }
            break;

          case 'portalLink':
            switch (operation) {
              case 'generate':
                responseData = await portalLink.generate.call(this, i);
                break;
            }
            break;

          case 'auditLog':
            switch (operation) {
              case 'get':
                responseData = await auditLog.get.call(this, i);
                break;
              case 'getAll':
                responseData = await auditLog.getAll.call(this, i);
                break;
              case 'createExport':
                responseData = await auditLog.createExport.call(this, i);
                break;
            }
            break;

          case 'webhook':
            switch (operation) {
              case 'create':
                responseData = await webhook.create.call(this, i);
                break;
              case 'get':
                responseData = await webhook.get.call(this, i);
                break;
              case 'getAll':
                responseData = await webhook.getAll.call(this, i);
                break;
              case 'update':
                responseData = await webhook.update.call(this, i);
                break;
              case 'delete':
                responseData = await webhook.deleteWebhook.call(this, i);
                break;
              case 'enable':
                responseData = await webhook.enable.call(this, i);
                break;
              case 'disable':
                responseData = await webhook.disable.call(this, i);
                break;
            }
            break;

          case 'role':
            switch (operation) {
              case 'create':
                responseData = await role.create.call(this, i);
                break;
              case 'get':
                responseData = await role.get.call(this, i);
                break;
              case 'getAll':
                responseData = await role.getAll.call(this, i);
                break;
              case 'update':
                responseData = await role.update.call(this, i);
                break;
              case 'delete':
                responseData = await role.deleteRole.call(this, i);
                break;
            }
            break;

          case 'invitation':
            switch (operation) {
              case 'create':
                responseData = await invitation.create.call(this, i);
                break;
              case 'get':
                responseData = await invitation.get.call(this, i);
                break;
              case 'getAll':
                responseData = await invitation.getAll.call(this, i);
                break;
              case 'revoke':
                responseData = await invitation.revoke.call(this, i);
                break;
            }
            break;

          default:
            throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
        }

        returnData.push(...responseData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
