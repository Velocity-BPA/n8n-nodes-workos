/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const WORKOS_BASE_URL = 'https://api.workos.com';

export const CONNECTION_TYPES = [
  { name: 'ADFS SAML', value: 'ADFSSAML' },
  { name: 'Azure SAML', value: 'AzureSAML' },
  { name: 'Generic OIDC', value: 'GenericOIDC' },
  { name: 'Generic SAML', value: 'GenericSAML' },
  { name: 'Google OAuth', value: 'GoogleOAuth' },
  { name: 'Google SAML', value: 'GoogleSAML' },
  { name: 'Microsoft OAuth', value: 'MicrosoftOAuth' },
  { name: 'Okta SAML', value: 'OktaSAML' },
  { name: 'PingFederate SAML', value: 'PingFederateSAML' },
  { name: 'PingOne SAML', value: 'PingOneSAML' },
  { name: 'OneLogin SAML', value: 'OneLoginSAML' },
];

export const DIRECTORY_TYPES = [
  { name: 'Azure SCIM v2.0', value: 'azure_scim_v2_0' },
  { name: 'BambooHR', value: 'bamboohr' },
  { name: 'Breathe HR', value: 'breathe_hr' },
  { name: 'Cezanne HR', value: 'cezanne_hr' },
  { name: 'CyberArk SCIM v2.0', value: 'cyberark_scim_v2_0' },
  { name: 'Fourth HR', value: 'fourth_hr' },
  { name: 'Generic SCIM v2.0', value: 'generic_scim_v2_0' },
  { name: 'Google Workspace', value: 'google_workspace' },
  { name: 'Gusto', value: 'gusto' },
  { name: 'HiBob', value: 'hibob' },
  { name: 'JumpCloud SCIM v2.0', value: 'jump_cloud_scim_v2_0' },
  { name: 'Okta SCIM v2.0', value: 'okta_scim_v2_0' },
  { name: 'OneLogin SCIM v2.0', value: 'onelogin_scim_v2_0' },
  { name: 'People HR', value: 'people_hr' },
  { name: 'Personio', value: 'personio' },
  { name: 'PingFederate SCIM v2.0', value: 'pingfederate_scim_v2_0' },
  { name: 'Rippling', value: 'rippling' },
  { name: 'SFTP', value: 'sftp' },
  { name: 'Workday', value: 'workday' },
];

export const PORTAL_INTENTS = [
  { name: 'SSO', value: 'sso' },
  { name: 'Directory Sync', value: 'dsync' },
  { name: 'Audit Logs', value: 'audit_logs' },
  { name: 'Log Streams', value: 'log_streams' },
  { name: 'Domain Verification', value: 'domain_verification' },
];

export const PASSWORD_HASH_TYPES = [
  { name: 'bcrypt', value: 'bcrypt' },
  { name: 'Firebase Scrypt', value: 'firebase-scrypt' },
  { name: 'SSHA', value: 'ssha' },
];

export const WEBHOOK_EVENTS = [
  // Authentication Events
  { name: 'Authentication: Email Verification Succeeded', value: 'authentication.email_verification_succeeded' },
  { name: 'Authentication: Magic Auth Failed', value: 'authentication.magic_auth_failed' },
  { name: 'Authentication: Magic Auth Succeeded', value: 'authentication.magic_auth_succeeded' },
  { name: 'Authentication: MFA Succeeded', value: 'authentication.mfa_succeeded' },
  { name: 'Authentication: OAuth Succeeded', value: 'authentication.oauth_succeeded' },
  { name: 'Authentication: Password Failed', value: 'authentication.password_failed' },
  { name: 'Authentication: Password Succeeded', value: 'authentication.password_succeeded' },
  { name: 'Authentication: SSO Succeeded', value: 'authentication.sso_succeeded' },
  // User Events
  { name: 'User: Created', value: 'user.created' },
  { name: 'User: Updated', value: 'user.updated' },
  { name: 'User: Deleted', value: 'user.deleted' },
  // Session Events
  { name: 'Session: Created', value: 'session.created' },
  // Organization Events
  { name: 'Organization: Created', value: 'organization.created' },
  { name: 'Organization: Updated', value: 'organization.updated' },
  { name: 'Organization: Deleted', value: 'organization.deleted' },
  { name: 'Organization Membership: Created', value: 'organization_membership.created' },
  { name: 'Organization Membership: Updated', value: 'organization_membership.updated' },
  { name: 'Organization Membership: Deleted', value: 'organization_membership.deleted' },
  // Directory Sync Events
  { name: 'Directory Sync: Activated', value: 'dsync.activated' },
  { name: 'Directory Sync: Deleted', value: 'dsync.deleted' },
  { name: 'Directory Sync Group: Created', value: 'dsync.group.created' },
  { name: 'Directory Sync Group: Updated', value: 'dsync.group.updated' },
  { name: 'Directory Sync Group: Deleted', value: 'dsync.group.deleted' },
  { name: 'Directory Sync Group: User Added', value: 'dsync.group.user_added' },
  { name: 'Directory Sync Group: User Removed', value: 'dsync.group.user_removed' },
  { name: 'Directory Sync User: Created', value: 'dsync.user.created' },
  { name: 'Directory Sync User: Updated', value: 'dsync.user.updated' },
  { name: 'Directory Sync User: Deleted', value: 'dsync.user.deleted' },
  // SSO Events
  { name: 'Connection: Activated', value: 'connection.activated' },
  { name: 'Connection: Deactivated', value: 'connection.deactivated' },
  { name: 'Connection: Deleted', value: 'connection.deleted' },
];

export const MEMBERSHIP_STATUSES = [
  { name: 'Active', value: 'active' },
  { name: 'Inactive', value: 'inactive' },
  { name: 'Pending', value: 'pending' },
];

export const CONNECTION_STATES = [
  { name: 'Active', value: 'active' },
  { name: 'Inactive', value: 'inactive' },
  { name: 'Draft', value: 'draft' },
  { name: 'Validating', value: 'validating' },
];

export const DIRECTORY_STATES = [
  { name: 'Active', value: 'active' },
  { name: 'Inactive', value: 'inactive' },
  { name: 'Deleting', value: 'deleting' },
  { name: 'Validating', value: 'validating' },
];

export const DIRECTORY_USER_STATES = [
  { name: 'Active', value: 'active' },
  { name: 'Inactive', value: 'inactive' },
];

// Licensing notice for runtime logging
export const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;
