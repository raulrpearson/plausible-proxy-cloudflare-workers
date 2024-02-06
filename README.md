# plausible-proxy-cloudflare-workers

> A one-click deployment Plausible Analytics proxy for Cloudflare Workers

For background on why you might want to proxy your Plausible Analytics, check out the
[docs](https://plausible.io/docs/proxy/introduction).

If you know you want this, just click this button and follow the instructions:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raulrpearson/plausible-proxy-cloudflare-workers)

After deploying, use this script in the sites that you'd like to track:

```html
<script
	defer
	data-domain="your-domain.com"
	data-api="https://your-worker-subdomain.workers.dev/pap/event"
	src="https://your-worker-subdomain.workers.dev/pap/script.js"
></script>
```

Notice that the paths on the `data-api` and `src` fields can (and should) be customised to diminish
the chances that your script is blocked, but notice that those two values need to remain in sync
with the values in the worker script:

```javascript
const SCRIPT_NAME = '/pap/script.js';
const ENDPOINT = '/pap/event';
```
