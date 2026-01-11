/**
 * Integration tests for WorkOS node
 *
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 * See LICENSE file for details
 */

import { WorkOS } from '../../nodes/WorkOS/WorkOS.node';
import { WorkOsTrigger } from '../../nodes/WorkOS/WorkOSTrigger.node';
import type { INodePropertyOptions } from 'n8n-workflow';

describe('WorkOS Node Integration', () => {
	describe('WorkOS Node', () => {
		let node: WorkOS;

		beforeEach(() => {
			node = new WorkOS();
		});

		it('should have correct node properties', () => {
			expect(node.description.displayName).toBe('WorkOS');
			expect(node.description.name).toBe('workOs');
			expect(node.description.group).toContain('transform');
			expect(node.description.version).toBe(1);
		});

		it('should require workOsApi credentials', () => {
			const credentials = node.description.credentials;
			expect(credentials).toBeDefined();
			expect(credentials).toHaveLength(1);
			expect(credentials![0].name).toBe('workOsApi');
			expect(credentials![0].required).toBe(true);
		});

		it('should have all resources defined', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty!.type).toBe('options');

			const options = resourceProperty!.options as INodePropertyOptions[];
			const resourceNames = options.map((o) => o.value);

			expect(resourceNames).toContain('user');
			expect(resourceNames).toContain('organization');
			expect(resourceNames).toContain('organizationMembership');
			expect(resourceNames).toContain('ssoConnection');
			expect(resourceNames).toContain('directory');
			expect(resourceNames).toContain('directoryUser');
			expect(resourceNames).toContain('directoryGroup');
			expect(resourceNames).toContain('portalLink');
			expect(resourceNames).toContain('auditLog');
			expect(resourceNames).toContain('webhook');
			expect(resourceNames).toContain('role');
			expect(resourceNames).toContain('invitation');
		});

		it('should have 12 resources', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const options = resourceProperty!.options as INodePropertyOptions[];
			expect(options).toHaveLength(12);
		});

		it('should have user operations defined', () => {
			const operationProperty = node.description.properties.find(
				(p) => {
					if (p.name !== 'operation') return false;
					const show = p.displayOptions?.show;
					if (!show) return false;
					const resource = show['resource'] as string[] | undefined;
					return resource?.includes('user');
				}
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as INodePropertyOptions[];
			const operationNames = options.map((o) => o.value);

			expect(operationNames).toContain('create');
			expect(operationNames).toContain('get');
			expect(operationNames).toContain('getByEmail');
			expect(operationNames).toContain('getAll');
			expect(operationNames).toContain('update');
			expect(operationNames).toContain('delete');
		});

		it('should have organization operations defined', () => {
			const operationProperty = node.description.properties.find(
				(p) => {
					if (p.name !== 'operation') return false;
					const show = p.displayOptions?.show;
					if (!show) return false;
					const resource = show['resource'] as string[] | undefined;
					return resource?.includes('organization');
				}
			);
			expect(operationProperty).toBeDefined();

			const options = operationProperty!.options as INodePropertyOptions[];
			const operationNames = options.map((o) => o.value);

			expect(operationNames).toContain('create');
			expect(operationNames).toContain('get');
			expect(operationNames).toContain('getAll');
			expect(operationNames).toContain('update');
			expect(operationNames).toContain('delete');
		});
	});

	describe('WorkOsTrigger Node', () => {
		let triggerNode: WorkOsTrigger;

		beforeEach(() => {
			triggerNode = new WorkOsTrigger();
		});

		it('should have correct node properties', () => {
			expect(triggerNode.description.displayName).toBe('WorkOS Trigger');
			expect(triggerNode.description.name).toBe('workOsTrigger');
			expect(triggerNode.description.group).toContain('trigger');
			expect(triggerNode.description.version).toBe(1);
		});

		it('should require workOsApi credentials', () => {
			const credentials = triggerNode.description.credentials;
			expect(credentials).toBeDefined();
			expect(credentials).toHaveLength(1);
			expect(credentials![0].name).toBe('workOsApi');
			expect(credentials![0].required).toBe(true);
		});

		it('should have events property', () => {
			const eventsProperty = triggerNode.description.properties.find(
				(p) => p.name === 'events'
			);
			expect(eventsProperty).toBeDefined();
			expect(eventsProperty!.type).toBe('multiOptions');
			expect(eventsProperty!.required).toBe(true);
		});

		it('should have verifySignature property', () => {
			const verifyProperty = triggerNode.description.properties.find(
				(p) => p.name === 'verifySignature'
			);
			expect(verifyProperty).toBeDefined();
			expect(verifyProperty!.type).toBe('boolean');
			expect(verifyProperty!.default).toBe(true);
		});

		it('should have webhook configuration', () => {
			const webhooks = triggerNode.description.webhooks;
			expect(webhooks).toBeDefined();
			expect(webhooks).toHaveLength(1);
			expect(webhooks![0].httpMethod).toBe('POST');
			expect(webhooks![0].path).toBe('webhook');
		});

		it('should have webhookMethods defined', () => {
			expect(triggerNode.webhookMethods).toBeDefined();
			expect(triggerNode.webhookMethods.default).toBeDefined();
			expect(triggerNode.webhookMethods.default.checkExists).toBeDefined();
			expect(triggerNode.webhookMethods.default.create).toBeDefined();
			expect(triggerNode.webhookMethods.default.delete).toBeDefined();
		});
	});
});
