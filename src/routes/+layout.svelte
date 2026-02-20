<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import "$lib/i18n"; // Import i18n init
	import { isLoading, locale } from "svelte-i18n";

	let { children } = $props();

	// Update direction on locale change
	$effect(() => {
		if (typeof document !== "undefined" && $locale) {
			const dir = $locale.startsWith("ar") ? "rtl" : "ltr";
			document.documentElement.dir = dir;
			document.documentElement.lang = $locale;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $isLoading}
	<div class="flex items-center justify-center h-screen">Loading...</div>
{:else}
	{@render children()}
{/if}
