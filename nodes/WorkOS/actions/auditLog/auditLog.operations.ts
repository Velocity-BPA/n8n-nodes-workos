/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { workOsApiRequest, workOsApiRequestAllItems, cleanEmptyProperties, parseJsonParameter } from '../../transport/workOsApi';
import { formatDate } from '../../utils/helpers';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const eventId = this.getNodeParameter('eventId', index) as string;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    `/audit_logs/events/${eventId}`,
  );

  return [{ json: response }];
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const organizationId = this.getNodeParameter('organizationId', index) as string;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const query: IDataObject = {
    organization_id: organizationId,
  };

  if (filters.actions) {
    query.actions = (filters.actions as string[]).join(',');
  }
  if (filters.actorNames) {
    query.actor_names = (filters.actorNames as string[]).join(',');
  }
  if (filters.actorIds) {
    query.actor_ids = (filters.actorIds as string[]).join(',');
  }
  if (filters.targets) {
    query.targets = parseJsonParameter(filters.targets, 'targets');
  }
  if (filters.rangeStart) {
    query.range_start = formatDate(filters.rangeStart as string);
  }
  if (filters.rangeEnd) {
    query.range_end = formatDate(filters.rangeEnd as string);
  }

  if (returnAll) {
    const events = await workOsApiRequestAllItems.call(
      this,
      'GET',
      '/audit_logs/events',
      {},
      query,
    );
    return events.map((event) => ({ json: event }));
  }

  const limit = this.getNodeParameter('limit', index) as number;
  query.limit = limit;

  const response = await workOsApiRequest.call(
    this,
    'GET',
    '/audit_logs/events',
    {},
    query,
  );

  return (response.data || []).map((event: any) => ({ json: event }));
}

export async function createExport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as string;
  const rangeStart = this.getNodeParameter('rangeStart', index) as string;
  const rangeEnd = this.getNodeParameter('rangeEnd', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    organization_id: organizationId,
    range_start: formatDate(rangeStart),
    range_end: formatDate(rangeEnd),
  };

  if (additionalFields.actions) {
    body.actions = additionalFields.actions;
  }
  if (additionalFields.actorNames) {
    body.actor_names = additionalFields.actorNames;
  }
  if (additionalFields.actorIds) {
    body.actor_ids = additionalFields.actorIds;
  }
  if (additionalFields.targets) {
    body.targets = parseJsonParameter(additionalFields.targets, 'targets');
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/audit_logs/exports',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}
