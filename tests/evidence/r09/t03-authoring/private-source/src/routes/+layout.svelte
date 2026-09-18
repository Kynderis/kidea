<script lang="ts">import {resolve} from '$app/paths';let {children}=$props();</script>
<svelte:head><meta name="robots" content="noindex,nofollow" /></svelte:head>
<a class="skip" href="#main">Đến nội dung</a>
<header><a href={resolve('/')}>Workshop thử nghiệm</a><nav aria-label="Điều hướng"><a href={resolve('/workshops')}>Danh sách workshop</a></nav></header>
<main id="main">{@render children()}</main>
<footer>Bài thử trong lab • Chưa phải dịch vụ đang phát hành</footer>
<style>
:global(body){margin:0;font:1rem/1.6 system-ui,sans-serif;color:#233746;background:#f5f7f9}:global(*){box-sizing:border-box}:global(a){color:#095985}:global(a:focus-visible),:global(button:focus-visible){outline:3px solid #9b5100;outline-offset:3px}header,main,footer{max-width:68rem;margin:auto;padding:1.25rem}header{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;border-bottom:1px solid #c9d6df}main{min-height:65vh}:global(h1){font-size:clamp(1.35rem,4vw,2rem);line-height:1.25}:global(p),:global(h1),:global(h2){overflow-wrap:anywhere}:global(article){background:white;border:1px solid #c9d6df;border-radius:.6rem;padding:1.25rem;margin:1rem 0}.skip{position:absolute;top:0;left:0;padding:.4rem 1.25rem;background:white;transform:translateY(-150%);z-index:2}.skip:focus{transform:translateY(0)}footer{font-size:.85rem;color:#4d626e}
</style>
