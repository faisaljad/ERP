<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        Users,
        Building2,
        MonitorPlay,
        TrendingUp,
        ShoppingCart,
        ShoppingBag,
        AlertTriangle,
    } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props<{ data: PageData }>();

    const formatCurrency = (amount: number) => amount.toFixed(2);
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString([], {
            month: "short",
            day: "numeric",
        });
    };
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <!-- Hardcoded initially, map to standard dashboard translations -->
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.dashboard.title")}
            </h1>
            <p class="text-gray-500 mt-1">
                {$_("modules.dashboard.subtitle")}
            </p>
        </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Metric 1: Total Sales -->
        <div
            class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
            <div
                class="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0"
            >
                <TrendingUp class="w-7 h-7" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500">
                    {$_("modules.dashboard.totalSales")}
                </p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1">
                    JD {formatCurrency(data.metrics.totalSales)}
                </h3>
            </div>
        </div>

        <!-- Metric 2: Open POS Sessions -->
        <div
            class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
            <div
                class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0"
            >
                <MonitorPlay class="w-7 h-7" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500">
                    {$_("modules.dashboard.activePos")}
                </p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1">
                    {data.metrics.openSessions}
                </h3>
            </div>
        </div>

        <!-- Metric 3: Total Customers -->
        <div
            class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
            <div
                class="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0"
            >
                <Users class="w-7 h-7" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500">
                    {$_("modules.dashboard.totalCustomers")}
                </p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1">
                    {data.metrics.totalCustomers}
                </h3>
            </div>
        </div>

        <!-- Metric 4: Active Vendors -->
        <div
            class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4"
        >
            <div
                class="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0"
            >
                <Building2 class="w-7 h-7" />
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500">
                    {$_("modules.dashboard.activeVendors")}
                </p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1">
                    {data.metrics.activeVendors}
                </h3>
            </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Orders -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Recent Sales Orders -->
            <div
                class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
                <div
                    class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"
                >
                    <h2 class="font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingCart class="w-5 h-5 text-gray-400" />
                        {$_("modules.dashboard.recentSales")}
                    </h2>
                    <a
                        href="/app/sales/orders"
                        class="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >{$_("modules.dashboard.viewAll")}</a
                    >
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead
                            class="text-xs text-gray-500 uppercase bg-gray-50/50"
                        >
                            <tr>
                                <th class="px-5 py-3 font-medium"
                                    >{$_("modules.dashboard.orderNumber")}</th
                                >
                                <th class="px-5 py-3 font-medium"
                                    >{$_("modules.dashboard.customer")}</th
                                >
                                <th
                                    class="px-5 py-3 font-medium text-right rtl:text-left"
                                    >{$_("modules.dashboard.total")}</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#if data.recentOrders.length === 0}
                                <tr>
                                    <td
                                        colspan="3"
                                        class="px-5 py-8 text-center text-gray-500"
                                        >{$_(
                                            "modules.dashboard.noRecentSales",
                                        )}</td
                                    >
                                </tr>
                            {:else}
                                {#each data.recentOrders as order}
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-5 py-3">
                                            <div
                                                class="font-medium text-gray-900"
                                            >
                                                {order.orderNumber}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {formatDate(
                                                    order.createdAt.toString(),
                                                )}
                                            </div>
                                        </td>
                                        <td class="px-5 py-3 text-gray-600"
                                            >{order.customer?.name || "-"}</td
                                        >
                                        <td
                                            class="px-5 py-3 font-bold text-gray-900 text-right rtl:text-left"
                                            >JD {formatCurrency(
                                                Number(order.total),
                                            )}</td
                                        >
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Purchase Orders -->
            <div
                class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
                <div
                    class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"
                >
                    <h2 class="font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag class="w-5 h-5 text-gray-400" />
                        {$_("modules.dashboard.recentPurchases")}
                    </h2>
                    <a
                        href="/app/purchasing/orders"
                        class="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >{$_("modules.dashboard.viewAll")}</a
                    >
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead
                            class="text-xs text-gray-500 uppercase bg-gray-50/50"
                        >
                            <tr>
                                <th class="px-5 py-3 font-medium"
                                    >{$_("modules.dashboard.poNumber")}</th
                                >
                                <th class="px-5 py-3 font-medium"
                                    >{$_("modules.dashboard.vendor")}</th
                                >
                                <th
                                    class="px-5 py-3 font-medium text-right rtl:text-left"
                                    >{$_("modules.dashboard.total")}</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#if data.recentPOs.length === 0}
                                <tr>
                                    <td
                                        colspan="3"
                                        class="px-5 py-8 text-center text-gray-500"
                                        >{$_(
                                            "modules.dashboard.noRecentPurchases",
                                        )}</td
                                    >
                                </tr>
                            {:else}
                                {#each data.recentPOs as po}
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-5 py-3">
                                            <div
                                                class="font-medium text-gray-900"
                                            >
                                                {po.orderNumber}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {formatDate(
                                                    po.createdAt.toString(),
                                                )}
                                            </div>
                                        </td>
                                        <td class="px-5 py-3 text-gray-600"
                                            >{po.vendor?.name || "-"}</td
                                        >
                                        <td
                                            class="px-5 py-3 font-bold text-gray-900 text-right rtl:text-left"
                                            >JD {formatCurrency(
                                                Number(po.total),
                                            )}</td
                                        >
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Right Column: Alerts & Summaries -->
        <div class="space-y-6">
            <!-- Low Stock Alerts -->
            <div
                class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
                <div class="p-5 border-b border-gray-100 bg-red-50/50">
                    <h2 class="font-bold text-gray-900 flex items-center gap-2">
                        <AlertTriangle class="w-5 h-5 text-red-500" />
                        {$_("modules.dashboard.lowStock")}
                    </h2>
                </div>
                <div class="p-5">
                    {#if data.lowStockItems.length === 0}
                        <div class="text-center text-sm text-gray-500 py-4">
                            {$_("modules.dashboard.allStockSufficient")}
                        </div>
                    {:else}
                        <div class="space-y-4">
                            {#each data.lowStockItems as item}
                                <div
                                    class="flex justify-between items-center group"
                                >
                                    <div>
                                        <a
                                            href="/app/inventory/items"
                                            class="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors"
                                            >{item.name}</a
                                        >
                                        <div
                                            class="text-xs text-gray-500 mt-0.5"
                                        >
                                            {item.sku}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="font-bold text-red-600 text-sm"
                                            >{item.currentStock}</span
                                        >
                                        <span class="text-xs text-gray-400"
                                            >/ {item.reorderLevel}
                                            {item.unit}</span
                                        >
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
