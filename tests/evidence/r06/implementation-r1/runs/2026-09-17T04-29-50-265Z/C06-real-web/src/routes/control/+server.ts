import { json } from '@sveltejs/kit';
import { release, waiting } from '$lib/server/barriers';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = ({url}) => json({waiting:waiting(url.searchParams.get('id') ?? '')},{headers:{'cache-control':'no-store'}});
export const POST: RequestHandler = ({url}) => {release(url.searchParams.get('id') ?? '');return json({released:true});};
