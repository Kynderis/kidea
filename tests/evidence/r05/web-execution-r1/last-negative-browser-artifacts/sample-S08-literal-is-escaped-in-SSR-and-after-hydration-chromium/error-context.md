# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sample.spec.ts >> S08 literal is escaped in SSR and after hydration
- Location: tests/browser/sample.spec.ts:5:1

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "<img src=x"
Received string:        "<!doctype html>
<html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/><!--1uha8ag--><meta name=\"robots\" content=\"noindex,nofollow\"/><!----><title>R05 Web sample</title></head><body data-sveltekit-preload-data=\"off\"><div style=\"display: contents\"><!--[--><!--[0--><!--[--><!--[--><h1>R05 synthetic Web sample</h1><p>Fake transport. This is not the Workshop application.</p> <p data-testid=\"literal\"><!----><img src=x onerror=alert(1)> & Workshop<!----></p> <button>Start U response</button><button>Switch to V</button><button>Release response</button> <button>Unmount model</button> <button>Send or reconcile admin X</button> <output data-testid=\"result\">ready</output> <!--[0--><button>Start child callback</button><!--]--> <button>Destroy child component</button> <button>Release child callback</button> <output data-testid=\"child-result\">ready</output> <button>Release stale history</button> <button>Resolve admin X FINAL</button><!--]--><!----><!--]--><!--]--> <!--[-1--><!--]--><!--]-->
			
			<script>
				{
					__sveltekit_1mul5vh = {
						base: new URL(\".\", location).pathname.slice(0, -1)
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import(\"./_app/immutable/entry/start.D7IWNsYh.js\"),
						import(\"./_app/immutable/entry/app.B1oz6iPW.js\")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 2],
							data: [null,null],
							form: null,
							error: null
						});
					});
				}
			</script>
		</div></body></html>
"
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | test('S01 real UI rejects delayed response after switching actor',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Start U response'}).click();await page.getByRole('button',{name:'Switch to V'}).click();await page.getByRole('button',{name:'Release response'}).click();await expect(page.getByTestId('result')).toContainText('"accepted":false');await expect(page.getByTestId('result')).not.toContainText('PRIVATE_U_ONLY');});
  3  | test('S09 delayed callback after model unmount',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Start U response'}).click();await page.getByRole('button',{name:'Unmount model'}).click();await page.getByRole('button',{name:'Release response'}).click();await expect(page.getByTestId('result')).toContainText('"accepted":false');});
  4  | test('S07 reload keeps unknown intent and only reconciles',async({page})=>{await page.goto('/');const button=page.getByRole('button',{name:'Send or reconcile admin X'});await button.click();await expect(page.getByTestId('result')).toContainText('"UNKNOWN"');await page.reload();await button.click();await expect(page.getByTestId('result')).toContainText('["POST","GET"]');await page.getByRole('button',{name:'Resolve admin X FINAL'}).click();await expect(page.getByTestId('result')).toContainText('"FINAL"');});
> 5  | test('S08 literal is escaped in SSR and after hydration',async({page,request})=>{const r=await request.get('/');const html=await r.text();expect(html).not.toContain('<img src=x');expect(html).toContain('&lt;img');await page.goto('/');await expect(page.getByTestId('literal')).toHaveText('<img src=x onerror=alert(1)> & Workshop');await expect(page.getByTestId('literal').locator('img')).toHaveCount(0);});
     |                                                                                                                                                            ^ Error: expect(received).not.toContain(expected) // indexOf
  6  | for(const [first,second] of [['U','V'],['V','U']])test(`S06 concurrent SSR ${first} then ${second}`,async({request})=>{const id=`${first}-${second}`;const pending=request.get(`/ssr?actor=${first}&barrier=${id}`);try{await expect.poll(async()=>{const r=await request.get(`/control?id=${id}`);return (await r.json()).waiting;}).toBe(true);const b=await request.get(`/ssr?actor=${second}`);expect(b.headers()['cache-control']).toBe('no-store');const bh=await b.text();expect(bh).toContain(`PRIVATE_${second}_ONLY`);expect(bh).not.toContain(`PRIVATE_${first}_ONLY`);}finally{await request.post(`/control?id=${id}`);}const a=await pending;expect(a.headers()['cache-control']).toBe('no-store');const ah=await a.text();expect(ah).toContain(`PRIVATE_${first}_ONLY`);expect(ah).not.toContain(`PRIVATE_${second}_ONLY`);});
  7  | test('private SSR also works with JS disabled',async({browser})=>{const context=await browser.newContext({javaScriptEnabled:false});try{const page=await context.newPage();await page.goto('http://127.0.0.1:4173/ssr?actor=U');await expect(page.getByTestId('private')).toHaveText('PRIVATE_U_ONLY');}finally{await context.close();}});
  8  | test('cookie override through SvelteKit HTTP create/read/replace/delete',async({request})=>{const set=await request.post('/cookie',{data:{actor:'U'}});expect(set.status()).toBe(200);const h=set.headers()['set-cookie'];expect(h).toContain('HttpOnly');expect(h).toContain('Secure');expect(h.toLowerCase()).toContain('samesite=strict');expect(h).toContain('Path=/');const read=await request.get('/cookie',{headers:{cookie:'lab_actor=U'}});expect((await read.json()).actor).toBe('U');const other=await request.get('/cookie',{headers:{cookie:'lab_actor=V'}});expect((await other.json()).actor).toBe('V');const del=await request.delete('/cookie');expect(del.headers()['set-cookie']).toContain('Max-Age=0');expect((await (await request.get('/cookie',{headers:{cookie:''}})).json()).actor).toBe(null);});
  9  | 
  10 | test('S09 actual Svelte component destruction rejects pending callback',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Start child callback'}).click();await page.getByRole('button',{name:'Destroy child component'}).click();await expect(page.getByRole('button',{name:'Start child callback'})).toHaveCount(0);await page.getByRole('button',{name:'Release child callback'}).click();await expect(page.getByTestId('child-result')).toHaveText('{"accepted":false,"values":[]}');});
  11 | 
  12 | test('S04 SSR keeps independent public/private versions',async({page})=>{await page.goto('/ssr?actor=U');await expect(page.getByTestId('public-audience')).toHaveText('100:PUBLIC_ONLY');await expect(page.getByTestId('private-audience')).toHaveText('4:PRIVATE_U_ONLY');await expect(page.getByTestId('public-audience')).not.toContainText('PRIVATE_');});
  13 | test('S05 rendered history retains cancellation and rebooking',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Release stale history'}).click();await expect(page.getByTestId('result')).toHaveText('A CANCELLED; B ACTIVE');});
  14 | 
```