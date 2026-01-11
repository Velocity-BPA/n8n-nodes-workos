# n8n-nodes-workos

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for WorkOS, the enterprise-ready authentication platform. This node enables workflow automation for Single Sign-On (SSO), Directory Sync (SCIM), user management, organizations, audit logging, and more.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![WorkOS](https://img.shields.io/badge/WorkOS-API-6363F1)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- **12 Resource Categories** - User, Organization, Organization Membership, SSO Connection, Directory, Directory User, Directory Group, Portal Link, Audit Log, Webhook, Role, and Invitation
- **70+ Operations** - Comprehensive CRUD operations plus specialized actions
- **Webhook Trigger** - Real-time event automation with signature verification
- **Cursor-based Pagination** - Efficient handling of large datasets with `returnAll` option
- **Rate Limit Handling** - Built-in support for WorkOS rate limits
- **Enterprise Authentication** - Full support for SAML, OIDC, and OAuth providers

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-workos` and click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-workos

# Restart n8n
n8n start
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-workos

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-workos

# Restart n8n
n8n start
```

## Credentials Setup

### WorkOS API Credentials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| API Key | String | Yes | Your WorkOS API key (sk_live_xxx or sk_test_xxx) |
| Client ID | String | No | WorkOS client ID (for SSO operations) |
| Webhook Secret | String | No | Webhook signing secret (for signature verification) |

**To obtain credentials:**

1. Log in to your [WorkOS Dashboard](https://dashboard.workos.com)
2. Navigate to **API Keys** in the sidebar
3. Copy your API key (production or staging)
4. For webhooks, go to **Webhooks** and copy the signing secret

## Resources & Operations

### User (AuthKit)

Manage users in your WorkOS AuthKit application.

| Operation | Description |
|-----------|-------------|
| Create | Create a new user |
| Get | Get user by ID |
| Get by Email | Find user by email address |
| Get All | List all users with pagination |
| Update | Update user properties |
| Delete | Permanently delete a user |
| Get Organization Memberships | List organizations the user belongs to |
| Send Magic Auth | Send magic link authentication email |
| Send Password Reset | Send password reset email |
| Verify Email | Send email verification link |
| Authenticate with Password | Authenticate user with password |
| Authenticate with Code | Authenticate with authorization code |
| Authenticate with Magic Auth | Authenticate with magic link |
| Authenticate with TOTP | Authenticate with time-based OTP |

### Organization

Manage organizations for multi-tenancy.

| Operation | Description |
|-----------|-------------|
| Create | Create a new organization |
| Get | Get organization by ID |
| Get All | List all organizations |
| Update | Update organization settings |
| Delete | Remove an organization |

### Organization Membership

Manage user memberships in organizations.

| Operation | Description |
|-----------|-------------|
| Create | Add user to organization |
| Get | Get membership by ID |
| Get All | List all memberships |
| Update | Update membership (role, etc.) |
| Delete | Remove membership |
| Deactivate | Deactivate membership |

### SSO Connection

Manage Single Sign-On connections.

| Operation | Description |
|-----------|-------------|
| Get | Get connection by ID |
| Get All | List all connections |
| Delete | Remove a connection |

**Supported Connection Types:**
- ADFSSAML, AzureSAML, GenericOIDC, GenericSAML
- GoogleOAuth, GoogleSAML, MicrosoftOAuth
- OktaSAML, PingFederateSAML, PingOneSAML, OneLoginSAML

### Directory

Manage Directory Sync configurations.

| Operation | Description |
|-----------|-------------|
| Get | Get directory by ID |
| Get All | List all directories |
| Delete | Remove a directory |

**Supported Directory Types:**
- SCIM: azure_scim_v2_0, okta_scim_v2_0, onelogin_scim_v2_0, generic_scim_v2_0
- HR Systems: bamboohr, gusto, rippling, workday, hibob, personio
- Other: google_workspace, sftp

### Directory User

Access synced directory users.

| Operation | Description |
|-----------|-------------|
| Get | Get directory user by ID |
| Get All | List all directory users |
| Get by Directory ID | List users in specific directory |

### Directory Group

Access synced directory groups.

| Operation | Description |
|-----------|-------------|
| Get | Get directory group by ID |
| Get All | List all directory groups |
| Get by Directory ID | List groups in specific directory |

### Portal Link

Generate Admin Portal links for self-service configuration.

| Operation | Description |
|-----------|-------------|
| Generate | Create Admin Portal session link |

**Portal Intents:**
- `sso` - SSO configuration
- `dsync` - Directory Sync configuration
- `audit_logs` - Audit log viewer
- `log_streams` - Log streaming configuration
- `domain_verification` - Domain verification

### Audit Log

Access audit log events for compliance.

| Operation | Description |
|-----------|-------------|
| Get | Get event by ID |
| Get All | List audit log events |
| Create Export | Export events to file |

### Webhook

Manage webhook endpoints.

| Operation | Description |
|-----------|-------------|
| Create | Create webhook endpoint |
| Get | Get webhook by ID |
| Get All | List all webhooks |
| Update | Update webhook settings |
| Delete | Remove webhook |
| Enable | Enable a webhook |
| Disable | Disable a webhook |

### Role

Manage custom roles for RBAC.

| Operation | Description |
|-----------|-------------|
| Create | Create custom role |
| Get | Get role by ID |
| Get All | List all roles |
| Update | Update role permissions |
| Delete | Remove role |

### Invitation

Manage user invitations.

| Operation | Description |
|-----------|-------------|
| Create | Create user invitation |
| Get | Get invitation by ID |
| Get All | List invitations |
| Revoke | Revoke pending invitation |

## Trigger Node

The **WorkOS Trigger** node allows you to start workflows when WorkOS events occur.

### Supported Events

**Authentication Events:**
- `authentication.email_verification_succeeded`
- `authentication.magic_auth_failed`
- `authentication.magic_auth_succeeded`
- `authentication.mfa_succeeded`
- `authentication.oauth_succeeded`
- `authentication.password_failed`
- `authentication.password_succeeded`
- `authentication.sso_succeeded`

**User Events:**
- `user.created`, `user.updated`, `user.deleted`

**Session Events:**
- `session.created`

**Organization Events:**
- `organization.created`, `organization.updated`, `organization.deleted`
- `organization_membership.created`, `organization_membership.updated`, `organization_membership.deleted`

**Directory Sync Events:**
- `dsync.activated`, `dsync.deleted`
- `dsync.user.created`, `dsync.user.updated`, `dsync.user.deleted`
- `dsync.group.created`, `dsync.group.updated`, `dsync.group.deleted`
- `dsync.group.user_added`, `dsync.group.user_removed`

**Connection Events:**
- `connection.activated`, `connection.deactivated`, `connection.deleted`

### Webhook Signature Verification

The trigger node supports cryptographic signature verification using HMAC SHA-256. Enable the "Verify Signature" option and provide your webhook secret in the credentials.

## Usage Examples

### Create a User and Add to Organization

```json
{
  "nodes": [
    {
      "name": "Create User",
      "type": "n8n-nodes-workos.workOs",
      "parameters": {
        "resource": "user",
        "operation": "create",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    {
      "name": "Add to Organization",
      "type": "n8n-nodes-workos.workOs",
      "parameters": {
        "resource": "organizationMembership",
        "operation": "create",
        "userId": "={{$node['Create User'].json.id}}",
        "organizationId": "org_xxx",
        "roleSlug": "member"
      }
    }
  ]
}
```

### Sync Directory Users on Event

```json
{
  "nodes": [
    {
      "name": "WorkOS Trigger",
      "type": "n8n-nodes-workos.workOsTrigger",
      "parameters": {
        "events": ["dsync.user.created", "dsync.user.updated"]
      }
    },
    {
      "name": "Update CRM",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.crm.com/users",
        "method": "POST",
        "body": "={{$json}}"
      }
    }
  ]
}
```

## WorkOS Concepts

### AuthKit
AuthKit is WorkOS's authentication solution that provides user management, passwordless login, and social authentication out of the box.

### Organizations
Organizations represent your customers (tenants) in a multi-tenant application. Each organization can have its own SSO configuration and directory sync.

### Directory Sync
Directory Sync (SCIM) automatically provisions and deprovisions users from identity providers like Okta, Azure AD, and HR systems.

### Admin Portal
The Admin Portal provides a white-labeled interface for your customers to configure SSO and Directory Sync without your involvement.

## Error Handling

The node provides detailed error messages for common scenarios:

| Error Code | Description | Resolution |
|------------|-------------|------------|
| `bad_request` | Invalid parameters | Check required fields and formats |
| `unauthorized` | Invalid API key | Verify your API key is correct |
| `forbidden` | Insufficient permissions | Check API key scopes |
| `entity_not_found` | Resource not found | Verify the resource ID exists |
| `conflict` | Duplicate resource | Resource already exists |
| `too_many_requests` | Rate limit exceeded | Wait and retry with backoff |

## Rate Limits

WorkOS enforces the following rate limits:

| Endpoint Type | Limit |
|--------------|-------|
| AuthKit writes | 500 per 10 seconds |
| General API | 6,000 per minute |

The node handles rate limits automatically with exponential backoff.

## Security Best Practices

1. **Use staging keys for development** - Never use production API keys in test environments
2. **Enable webhook signature verification** - Always verify webhook signatures in production
3. **Store credentials securely** - Use n8n's credential encryption
4. **Implement least privilege** - Create API keys with minimum required permissions
5. **Monitor audit logs** - Regularly review audit logs for suspicious activity

## Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Build the project
npm run build

# Run tests with coverage
npm run test:coverage
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Documentation**: [WorkOS API Docs](https://workos.com/docs)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-workos/issues)
- **Email**: support@velobpa.com

## Acknowledgments

- [WorkOS](https://workos.com) for their excellent enterprise authentication platform
- [n8n](https://n8n.io) for the powerful workflow automation framework
- The open-source community for their contributions
