import type {
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	smsOperations,
	smsFields,
} from './actions/sms.operations';

import {
	smsResource,
} from './sms.resource';

export const hostedSmsDescription: INodeTypeDescription = {
	displayName: 'HostedSMS',
	name: 'hostedSms',
	icon: 'file:hostedsms.svg',
	group: ['transform'],
	version: 1,
	description: 'Send SMS via HostedSMS.pl',
	defaults: {
		name: 'HostedSMS',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'hostedSmsApi',
			required: true,
		},
	],
	properties: [
		...smsResource,
		...smsOperations,
		...smsFields,
	],
};
