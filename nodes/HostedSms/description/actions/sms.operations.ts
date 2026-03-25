import type {
	INodeProperties,
} from 'n8n-workflow';

export const smsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'sms',
				],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				action: 'Send an SMS',
				routing: {
					request: {
						method: 'POST',
						url: '/Smses',
					},
				},
			},
			{
				name: 'Receive',
				value: 'receive',
				action: 'Receive SMS messages',
				routing: {
					request: {
						method: 'GET',
						url: '/InputSmses',
					},
				},
			},
		],
		default: 'send',
	},
];

export const smsFields: INodeProperties[] = [
	{
		displayName: 'Sender Name or ID',
		name: 'from',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSenders',
		},
		default: '',
		placeholder: 'Sender',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'sms',
				],
				operation: [
					'send',
				],
			},
		},
		description: 'The sender name (must be pre-approved in hostedsms.pl). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		default: '',
		placeholder: '48xxxxxxxxx',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'sms',
				],
				operation: [
					'send',
				],
			},
		},
		description: 'The recipient phone number (with country prefix)',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'sms',
				],
				operation: [
					'send',
				],
			},
		},
		description: 'The message content',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: [
					'sms',
				],
				operation: [
					'receive',
				],
			},
		},
		description: 'Max number of results to return',
	},
];
