/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IWorkOsUser {
  id: string;
  email: string;
  email_verified: boolean;
  first_name: string | null;
  last_name: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface IWorkOsOrganization {
  id: string;
  name: string;
  allow_profiles_outside_organization: boolean;
  domains: IWorkOsDomain[];
  created_at: string;
  updated_at: string;
}

export interface IWorkOsDomain {
  id: string;
  domain: string;
  state: 'verified' | 'pending';
  organization_id: string;
}

export interface IWorkOsOrganizationMembership {
  id: string;
  user_id: string;
  organization_id: string;
  role: {
    slug: string;
  };
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface IWorkOsSsoConnection {
  id: string;
  organization_id: string;
  connection_type: string;
  name: string;
  state: 'active' | 'inactive' | 'draft' | 'validating';
  created_at: string;
  updated_at: string;
}

export interface IWorkOsDirectory {
  id: string;
  organization_id: string;
  type: string;
  name: string;
  state: 'active' | 'inactive' | 'deleting' | 'validating';
  domain: string | null;
  created_at: string;
  updated_at: string;
}

export interface IWorkOsDirectoryUser {
  id: string;
  directory_id: string;
  organization_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  state: 'active' | 'inactive';
  raw_attributes: Record<string, unknown>;
  custom_attributes: Record<string, unknown>;
  groups: IWorkOsDirectoryGroup[];
  created_at: string;
  updated_at: string;
}

export interface IWorkOsDirectoryGroup {
  id: string;
  directory_id: string;
  organization_id: string;
  name: string;
  raw_attributes: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface IWorkOsPortalLink {
  link: string;
}

export interface IWorkOsAuditLogEvent {
  id: string;
  organization_id: string;
  action: {
    id: string;
    name: string;
    type: string;
  };
  actor: {
    id: string;
    name: string;
    type: string;
  };
  targets: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  context: {
    location: string;
    user_agent: string;
  };
  occurred_at: string;
}

export interface IWorkOsWebhook {
  id: string;
  url: string;
  events: string[];
  state: 'active' | 'inactive';
  secret: string;
  created_at: string;
  updated_at: string;
}

export interface IWorkOsRole {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: 'EnvironmentRole' | 'OrganizationRole';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface IWorkOsInvitation {
  id: string;
  email: string;
  organization_id: string | null;
  state: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IWorkOsListResponse<T> {
  data: T[];
  list_metadata: {
    before: string | null;
    after: string | null;
  };
}

export interface IWorkOsError {
  message: string;
  code: string;
  entity_id?: string;
}

export type WorkOsResource =
  | 'user'
  | 'organization'
  | 'organizationMembership'
  | 'ssoConnection'
  | 'directory'
  | 'directoryUser'
  | 'directoryGroup'
  | 'portalLink'
  | 'auditLog'
  | 'webhook'
  | 'role'
  | 'invitation';

export type WorkOsUserOperation =
  | 'create'
  | 'get'
  | 'getByEmail'
  | 'getAll'
  | 'update'
  | 'delete'
  | 'getOrganizationMemberships'
  | 'sendMagicAuth'
  | 'sendPasswordReset'
  | 'verifyEmail'
  | 'authenticateWithPassword'
  | 'authenticateWithCode'
  | 'authenticateWithMagicAuth'
  | 'authenticateWithTotp';

export type WorkOsOrganizationOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'update'
  | 'delete';

export type WorkOsOrganizationMembershipOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'update'
  | 'delete'
  | 'deactivate';

export type WorkOsSsoConnectionOperation = 'get' | 'getAll' | 'delete';

export type WorkOsDirectoryOperation = 'get' | 'getAll' | 'delete';

export type WorkOsDirectoryUserOperation = 'get' | 'getAll' | 'getByDirectoryId';

export type WorkOsDirectoryGroupOperation = 'get' | 'getAll' | 'getByDirectoryId';

export type WorkOsPortalLinkOperation = 'generate';

export type WorkOsAuditLogOperation = 'get' | 'getAll' | 'createExport';

export type WorkOsWebhookOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'update'
  | 'delete'
  | 'enable'
  | 'disable';

export type WorkOsRoleOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete';

export type WorkOsInvitationOperation = 'create' | 'get' | 'getAll' | 'revoke';
