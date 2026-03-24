import {
	NodeApiError,
} from 'n8n-workflow';
import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

/**
 * Make an API request to hostedsms.pl
 */
export async function hostedsmsApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const url = uri || `https://api.hostedsms.pl/FullApi/${resource}`;
	const options: IHttpRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs,
		url,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	const responseData = (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'hostedSmsApi',
		options,
	)) as IDataObject | IDataObject[];

	const node = (this as any).getNode ? (this as any).getNode() : undefined;

	if (responseData && !Array.isArray(responseData) && typeof responseData === 'object') {
		if (responseData.ErrorMessage) {
			throw new NodeApiError(node, responseData as any, {
				message: responseData.ErrorMessage as string,
			});
		}
	} else if (Array.isArray(responseData)) {
		for (const item of responseData) {
			if (item.ErrorMessage) {
				throw new NodeApiError(node, item as any, {
					message: item.ErrorMessage as string,
				});
			}
		}
	}

	return responseData;
}
