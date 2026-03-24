import type {
	INodeProperties,
} from 'n8n-workflow';

export const smsResource: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'SMS',
				value: 'sms',
			},
		],
		default: 'sms',
	},
];
