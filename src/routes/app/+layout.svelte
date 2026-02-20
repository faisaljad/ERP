<script lang="ts">
    import { page } from "$app/state";
    import {
        LayoutDashboard,
        Calculator,
        Package,
        Settings,
        Building2,
        ShoppingCart,
        ShoppingBag,
        Users,
        LogOut,
    } from "lucide-svelte";

    let { children } = $props();
    // page.url.pathname is available via page store in Svelte 5?
    // In SvelteKit 2, page is a store. in Svelte 5 runes mode, we use $page store or page rune if available.
    // Actually, standard SvelteKit use:
    import { page as pageStore } from "$app/stores";
    import { _, locale } from "svelte-i18n";
    import { Languages } from "lucide-svelte"; // Import Languages icon

    // sidebar items with translation keys
    const menuItems = [
        { href: "/app", label: "common.dashboard", icon: LayoutDashboard },
        {
            href: "/app/accounting",
            label: "common.accounting",
            icon: Calculator,
        },
        { href: "/app/inventory", label: "common.inventory", icon: Package },
        {
            href: "/app/sales",
            label: "modules.sales.title",
            icon: ShoppingCart,
        },
        {
            href: "/app/purchasing",
            label: "modules.purchasing.title",
            icon: ShoppingBag,
        },
        { href: "/app/hr", label: "common.hr", icon: Users },
        { href: "/app/settings", label: "common.settings", icon: Settings },
    ];

    function toggleLanguage() {
        if ($locale === "en") {
            locale.set("ar");
        } else {
            locale.set("en");
        }
    }
</script>

<div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
        class="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col"
    >
        <div class="p-6 border-b border-gray-100 flex items-center gap-2">
            <div class="p-2 bg-blue-600 rounded-lg">
                <Building2 class="w-6 h-6 text-white" />
            </div>
            <span class="font-bold text-xl text-gray-800">ERP System</span>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            {#each menuItems as item}
                <a
                    href={item.href}
                    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                  {$pageStore.url.pathname === item.href ||
                    $pageStore.url.pathname.startsWith(item.href + '/')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
                >
                    <item.icon class="w-5 h-5" />
                    {$_(item.label)}
                </a>
            {/each}
        </nav>

        <div class="p-4 border-t border-gray-100">
            <div class="flex items-center gap-3 px-3 py-2 mb-2">
                <div
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
                >
                    {$pageStore.data.user?.name?.charAt(0) || "U"}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                        {$pageStore.data.user?.name}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                        {$pageStore.data.user?.role}
                    </p>
                </div>
            </div>
            <form action="/logout" method="POST">
                <button
                    type="submit"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                    <LogOut class="w-5 h-5" />
                    Sign out
                </button>
            </form>
            <button
                onclick={toggleLanguage}
                class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50 transition-colors mt-2"
            >
                <Languages class="w-5 h-5" />
                {$locale === "en" ? "العربية" : "English"}
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
        <header
            class="bg-white border-b border-gray-200 p-4 md:hidden flex items-center justify-between"
        >
            <span class="font-bold text-lg">ERP System</span>
            <!-- Mobile menu button logic here if needed -->
        </header>
        <div class="p-8 max-w-7xl mx-auto">
            {@render children()}
        </div>
    </main>
</div>
