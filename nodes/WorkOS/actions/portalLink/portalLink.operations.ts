/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { workOsApiRequest, cleanEmptyProperties } from '../../transport/workOsApi';

export async function generate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const organizationId = this.getNodeParameter('organizationId', index) as string;
  const intent = this.getNodeParameter('intent', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const body: IDataObject = {
    organization: organizationId,
    intent,
  };

  if (additionalFields.returnUrl) {
    body.return_url = additionalFields.returnUrl;
  }
  if (additionalFields.successUrl) {
    body.success_url = additionalFields.successUrl;
  }

  const response = await workOsApiRequest.call(
    this,
    'POST',
    '/portal/generate_link',
    cleanEmptyProperties(body),
  );

  return [{ json: response }];
}
