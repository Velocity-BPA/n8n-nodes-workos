/**
 * Unit tests for WorkOS constants
 *
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 * See LICENSE file for details
 */

import {
	CONNECTION_TYPES,
	DIRECTORY_TYPES,
	PORTAL_INTENTS,
	WEBHOOK_EVENTS,
	MEMBERSHIP_STATUSES,
	LICENSING_NOTICE,
} from '../../nodes/WorkOS/constants/constants';

describe('WorkOS Constants', () => {
	describe('CONNECTION_TYPES', () => {
		it('should contain all SSO connection types', () => {
			const typeValues = CONNECTION_TYPES.map((t) => t.value);
			expect(typeValues).toContain('ADFSSAML');
			expect(typeValues).toContain('AzureSAML');
			expect(typeValues).toContain('GenericOIDC');
			expect(typeValues).toContain('GenericSAML');
			expect(typeValues).toContain('GoogleOAuth');
			expect(typeValues).toContain('GoogleSAML');
			expect(typeValues).toContain('MicrosoftOAuth');
			expect(typeValues).toContain('OktaSAML');
			expect(typeValues).toContain('PingFederateSAML');
			expect(typeValues).toContain('PingOneSAML');
			expect(typeValues).toContain('OneLoginSAML');
		});

		it('should have 11 connection types', () => {
			expect(CONNECTION_TYPES).toHaveLength(11);
		});
	});

	describe('DIRECTORY_TYPES', () => {
		it('should contain common directory types', () => {
			const typeValues = DIRECTORY_TYPES.map((t) => t.value);
			expect(typeValues).toContain('azure_scim_v2_0');
			expect(typeValues).toContain('google_workspace');
			expect(typeValues).toContain('okta_scim_v2_0');
			expect(typeValues).toContain('generic_scim_v2_0');
		});

		it('should contain HR system directory types', () => {
			const typeValues = DIRECTORY_TYPES.map((t) => t.value);
			expect(typeValues).toContain('bamboohr');
			expect(typeValues).toContain('gusto');
			expect(typeValues).toContain('rippling');
			expect(typeValues).toContain('workday');
		});

		it('should have 19 directory types', () => {
			expect(DIRECTORY_TYPES).toHaveLength(19);
		});
	});

	describe('PORTAL_INTENTS', () => {
		it('should contain all portal intents', () => {
			const intentValues = PORTAL_INTENTS.map((i) => i.value);
			expect(intentValues).toContain('sso');
			expect(intentValues).toContain('dsync');
			expect(intentValues).toContain('audit_logs');
			expect(intentValues).toContain('log_streams');
			expect(intentValues).toContain('domain_verification');
		});

		it('should have 5 portal intents', () => {
			expect(PORTAL_INTENTS).toHaveLength(5);
		});
	});

	describe('WEBHOOK_EVENTS', () => {
		it('should contain authentication events', () => {
			const eventValues = WEBHOOK_EVENTS.map((e) => e.value);
			expect(eventValues).toContain('authentication.email_verification_succeeded');
			expect(eventValues).toContain('authentication.magic_auth_succeeded');
			expect(eventValues).toContain('authentication.password_succeeded');
			expect(eventValues).toContain('authentication.sso_succeeded');
		});

		it('should contain user events', () => {
			const eventValues = WEBHOOK_EVENTS.map((e) => e.value);
			expect(eventValues).toContain('user.created');
			expect(eventValues).toContain('user.updated');
			expect(eventValues).toContain('user.deleted');
		});

		it('should contain organization events', () => {
			const eventValues = WEBHOOK_EVENTS.map((e) => e.value);
			expect(eventValues).toContain('organization.created');
			expect(eventValues).toContain('organization.updated');
			expect(eventValues).toContain('organization.deleted');
		});

		it('should contain directory sync events', () => {
			const eventValues = WEBHOOK_EVENTS.map((e) => e.value);
			expect(eventValues).toContain('dsync.activated');
			expect(eventValues).toContain('dsync.user.created');
			expect(eventValues).toContain('dsync.group.created');
		});

		it('should contain connection events', () => {
			const eventValues = WEBHOOK_EVENTS.map((e) => e.value);
			expect(eventValues).toContain('connection.activated');
			expect(eventValues).toContain('connection.deactivated');
			expect(eventValues).toContain('connection.deleted');
		});
	});

	describe('MEMBERSHIP_STATUSES', () => {
		it('should contain all membership statuses', () => {
			const statusValues = MEMBERSHIP_STATUSES.map((s) => s.value);
			expect(statusValues).toContain('active');
			expect(statusValues).toContain('inactive');
			expect(statusValues).toContain('pending');
		});

		it('should have 3 statuses', () => {
			expect(MEMBERSHIP_STATUSES).toHaveLength(3);
		});
	});

	describe('LICENSING_NOTICE', () => {
		it('should contain Velocity BPA reference', () => {
			expect(LICENSING_NOTICE).toContain('Velocity BPA');
		});

		it('should contain BSL 1.1 reference', () => {
			expect(LICENSING_NOTICE).toContain('BSL 1.1');
		});

		it('should contain licensing URL', () => {
			expect(LICENSING_NOTICE).toContain('https://velobpa.com/licensing');
		});
	});
});
