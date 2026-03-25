import {
	IExecuteFunctions,
	INodeExecutionData,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import { randomUUID } from 'crypto';

import {
	hostedsmsApiRequest,
} from './transport/request';

import {
	smsOperations,
	smsFields,
} from './description/actions/sms.operations';

import {
	smsResource,
} from './description/sms.resource';



export class HostedSms implements INodeType {
	description: INodeTypeDescription = {
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
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getSenders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const responseData = await hostedsmsApiRequest.call(this, 'GET', '/ValidSenders') as IDataObject;
				const senders = responseData.Senders as string[];
				return senders.sort().map((sender) => ({
					name: sender,
					value: sender,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'sms') {
					if (operation === 'send') {
						const from = this.getNodeParameter('from', i) as string;
						const to = this.getNodeParameter('to', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						const body = {
							Sender: from,
							Phones: [to],
							Message: message,
							TransactionId: randomUUID(),
						};

						const responseData = await hostedsmsApiRequest.call(this, 'POST', '/Smses', body);
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					} else if (operation === 'receive') {
						const limit = this.getNodeParameter('limit', i) as number;

						const qs: IDataObject = {
							Limit: limit,
						};

						const responseData = await hostedsmsApiRequest.call(this, 'GET', '/InputSmses', {}, qs);

						// The response might be { InputSmses: [...], CurrentTime: ... } or just the array if handled by helper
						let messages = responseData;
						if (responseData && !Array.isArray(responseData) && responseData.InputSmses) {
							messages = responseData.InputSmses as IDataObject[];
						}

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(messages),
							{ itemData: { item: i } },
						);
						returnData.push(...executionData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
