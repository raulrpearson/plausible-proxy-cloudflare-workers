/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const SCRIPT_NAME = '/pap/script.js';
const ENDPOINT = '/pap/event';

const SCRIPT_WITHOUT_EXTENSION = SCRIPT_NAME.replace('.js', '');

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const pathname = new URL(request.url).pathname;
		const [baseUri, ...extensions] = pathname.split('.');

		if (baseUri.endsWith(SCRIPT_WITHOUT_EXTENSION)) {
			let response = await caches.default.match(request);
			if (!response) {
				response = await fetch('https://plausible.io/js/plausible.' + extensions.join('.'));
				ctx.waitUntil(caches.default.put(request, response.clone()));
			}
			return response;
		} else if (pathname.endsWith(ENDPOINT)) {
			const requestClone = new Request(request);
			requestClone.headers.delete('cookie');
			return fetch('https://plausible.io/api/event', requestClone);
		}
		return new Response(null, { status: 404 });
	},
};
