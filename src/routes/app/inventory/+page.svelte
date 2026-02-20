<script lang="ts">
    import {
        Package,
        Truck,
        Boxes,
        Building2,
        AlertTriangle,
        XCircle,
        CheckCircle,
    } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data } = $props();
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.inventory.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.inventory.subtitle")}
            </p>
        </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-blue-50 rounded-lg">
                    <Package class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">
                        {$_("modules.inventory.dashboard.totalItems")}
                    </p>
                    <p class="text-2xl font-bold text-gray-900">
                        {data.stats.totalItems}
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle class="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">
                        {$_("modules.inventory.dashboard.lowStock")}
                    </p>
                    <p class="text-2xl font-bold text-gray-900">
                        {data.stats.lowStockCount}
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-red-50 rounded-lg">
                    <XCircle class="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-500">
                        {$_("modules.inventory.dashboard.outOfStock")}
                    </p>
                    <p class="text-2xl font-bold text-gray-900">
                        {data.stats.outOfStockCount}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Alerts Section -->
    {#if data.outOfStockItems.length > 0 || data.lowStockItems.length > 0}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Out of Stock List -->
            {#if data.outOfStockItems.length > 0}
                <div
                    class="bg-white rounded-lg border border-red-200 shadow-sm overflow-hidden"
                >
                    <div
                        class="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between"
                    >
                        <h3
                            class="font-bold text-red-800 flex items-center gap-2"
                        >
                            <XCircle class="w-4 h-4" />
                            {$_("modules.inventory.dashboard.outOfStock")}
                        </h3>
                    </div>
                    <div class="divide-y divide-gray-100">
                        {#each data.outOfStockItems as item}
                            <div
                                class="px-6 py-3 flex justify-between items-center hover:bg-gray-50"
                            >
                                <div>
                                    <p class="font-medium text-gray-900">
                                        {item.name}
                                    </p>
                                    <p class="text-xs text-gray-500">
                                        {$_("modules.inventory.dashboard.sku")}: {item.sku}
                                    </p>
                                </div>
                                <span
                                    class="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full"
                                >
                                    {item.currentStock}
                                    {item.unit}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Low Stock List -->
            {#if data.lowStockItems.length > 0}
                <div
                    class="bg-white rounded-lg border border-yellow-200 shadow-sm overflow-hidden"
                >
                    <div
                        class="px-6 py-4 bg-yellow-50 border-b border-yellow-100 flex items-center justify-between"
                    >
                        <h3
                            class="font-bold text-yellow-800 flex items-center gap-2"
                        >
                            <AlertTriangle class="w-4 h-4" />
                            {$_("modules.inventory.dashboard.lowStock")}
                        </h3>
                    </div>
                    <div class="divide-y divide-gray-100">
                        {#each data.lowStockItems as item}
                            <div
                                class="px-6 py-3 flex justify-between items-center hover:bg-gray-50"
                            >
                                <div>
                                    <p class="font-medium text-gray-900">
                                        {item.name}
                                    </p>
                                    <p class="text-xs text-gray-500">
                                        {$_(
                                            "modules.inventory.dashboard.reorder",
                                        )}: {item.reorderLevel}
                                    </p>
                                </div>
                                <span
                                    class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full"
                                >
                                    {item.currentStock}
                                    {item.unit}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    <h2 class="text-lg font-bold text-gray-900 mt-8">
        {$_("modules.inventory.dashboard.quickActions")}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
            href="/app/inventory/categories"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-green-50 rounded-lg w-fit group-hover:bg-green-100 transition-colors"
            >
                <Boxes class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.inventory.categories")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.inventory.dashboard.manageCategories")}
            </p>
        </a>

        <a
            href="/app/inventory/items"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors"
            >
                <Package class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.inventory.items")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.inventory.dashboard.manageItems")}
            </p>
        </a>

        <a
            href="/app/inventory/warehouses"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-indigo-50 rounded-lg w-fit group-hover:bg-indigo-100 transition-colors"
            >
                <Building2
                    class="w-6 h-6 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.inventory.warehouses")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.inventory.dashboard.manageWarehouses")}
            </p>
        </a>

        <a
            href="/app/inventory/movements"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-orange-50 rounded-lg w-fit group-hover:bg-orange-100 transition-colors"
            >
                <Truck class="w-6 h-6 text-orange-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.inventory.movements")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.inventory.dashboard.manageMovements")}
            </p>
        </a>
    </div>
</div>
