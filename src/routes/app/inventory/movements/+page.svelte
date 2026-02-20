<script lang="ts">
    import {
        Truck,
        ArrowUpRight,
        ArrowDownLeft,
        ArrowRightLeft,
        RefreshCw,
        Plus,
    } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data } = $props();

    function getTypeIcon(type: string) {
        switch (type) {
            case "IN":
                return ArrowDownLeft;
            case "OUT":
                return ArrowUpRight;
            case "TRANSFER":
                return ArrowRightLeft;
            default:
                return RefreshCw;
        }
    }

    function getTypeColor(type: string) {
        switch (type) {
            case "IN":
                return "text-green-600 bg-green-50";
            case "OUT":
                return "text-red-600 bg-red-50";
            case "TRANSFER":
                return "text-blue-600 bg-blue-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.inventory.movementsPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.inventory.movementsPage.subtitle")}
            </p>
        </div>
        <div class="flex gap-2">
            <a
                href="/app/inventory/movements/create?type=IN"
                class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
                <ArrowDownLeft class="w-4 h-4" />
                {$_("modules.inventory.movementsPage.stockIn")}
            </a>
            <a
                href="/app/inventory/movements/create?type=OUT"
                class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
                <ArrowUpRight class="w-4 h-4" />
                {$_("modules.inventory.movementsPage.stockOut")}
            </a>
            <a
                href="/app/inventory/movements/create?type=TRANSFER"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                <Plus class="w-4 h-4" />
                {$_("modules.inventory.movementsPage.newMovement")}
            </a>
        </div>
    </div>

    <div
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.movementsPage.date")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.movementsPage.type")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.movementsPage.item")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.movementsPage.warehouse")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.movementsPage.quantity")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.movementsPage.reference")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.movements as movement}
                    {@const Icon = getTypeIcon(movement.type)}
                    {@const colorClass = getTypeColor(movement.type)}
                    <tr class="hover:bg-gray-50">
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {new Date(movement.createdAt).toLocaleString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div
                                    class={`p-1.5 rounded-full me-2 ${colorClass}`}
                                >
                                    <Icon class="w-4 h-4" />
                                </div>
                                <span class="text-sm font-medium text-gray-900"
                                    >{$_(
                                        `modules.inventory.movementsPage.types.${movement.type}`,
                                    )}</span
                                >
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                            <div class="font-medium">{movement.item.name}</div>
                            <div class="text-xs text-gray-500 font-mono">
                                {movement.item.sku}
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {movement.warehouse.name}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-end font-medium {movement.quantity >
                            0
                                ? 'text-green-600'
                                : 'text-red-600'}"
                        >
                            {movement.quantity > 0
                                ? "+"
                                : ""}{movement.quantity}
                            {movement.item.unit}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {movement.reference || "-"}
                        </td>
                    </tr>
                {/each}
                {#if data.movements.length === 0}
                    <tr>
                        <td
                            colspan="6"
                            class="px-6 py-12 text-center text-gray-500"
                        >
                            {$_("modules.inventory.movementsPage.noMovements")}
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
