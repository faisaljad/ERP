<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { Save, ArrowLeft } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data, form } = $props();

    // Get type from URL or default to IN
    let type = $state($page.url.searchParams.get("type") || "IN");
</script>

<div class="max-w-2xl mx-auto py-8">
    <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a
                href="/app/inventory/movements"
                class="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            >
                <ArrowLeft class="w-5 h-5 rtl:rotate-180" />
            </a>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.inventory.movementsPage.recordTitle")}
            </h1>
        </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form method="POST" use:enhance class="space-y-6">
            <!-- Type Selection -->
            <div>
                <div class="block text-sm font-medium text-gray-700 mb-2">
                    {$_("modules.inventory.movementsPage.movementType")}
                </div>
                <div class="flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        onclick={() => (type = "IN")}
                        class={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-s-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${type === "IN" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-900"}`}
                    >
                        {$_("modules.inventory.movementsPage.types.IN")}
                    </button>
                    <button
                        type="button"
                        onclick={() => (type = "OUT")}
                        class={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${type === "OUT" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-900"}`}
                    >
                        {$_("modules.inventory.movementsPage.types.OUT")}
                    </button>
                    <button
                        type="button"
                        onclick={() => (type = "TRANSFER")}
                        class={`px-4 py-2 text-sm font-medium border-t border-b border-l border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${type === "TRANSFER" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-900"}`}
                    >
                        {$_("modules.inventory.movementsPage.types.TRANSFER")}
                    </button>
                    <button
                        type="button"
                        onclick={() => (type = "ADJUSTMENT")}
                        class={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-e-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${type === "ADJUSTMENT" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-900"}`}
                    >
                        {$_("modules.inventory.movementsPage.types.ADJUSTMENT")}
                    </button>
                </div>
                <input type="hidden" name="type" value={type} />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        for="itemId"
                        class="block text-sm font-medium text-gray-700"
                        >{$_("modules.inventory.movementsPage.item")}</label
                    >
                    <select
                        name="itemId"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        <option value="" disabled selected
                            >{$_(
                                "modules.inventory.movementsPage.selectItem",
                            )}</option
                        >
                        {#each data.items as item}
                            <option value={item.id}
                                >{item.sku} - {item.name}</option
                            >
                        {/each}
                    </select>
                </div>

                <div>
                    <label
                        for="warehouseId"
                        class="block text-sm font-medium text-gray-700"
                        >{$_(
                            "modules.inventory.movementsPage.warehouse",
                        )}</label
                    >
                    <select
                        name="warehouseId"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        <option value="" disabled selected
                            >{$_(
                                "modules.inventory.movementsPage.selectWarehouse",
                            )}</option
                        >
                        {#each data.warehouses as wh}
                            <option value={wh.id}>{wh.name}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        for="quantity"
                        class="block text-sm font-medium text-gray-700"
                        >{$_("modules.inventory.movementsPage.quantity")}</label
                    >
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            required
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            placeholder="0"
                        />
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                        {$_("modules.inventory.movementsPage.quantityHelp")}
                    </p>
                </div>

                <div>
                    <label
                        for="reference"
                        class="block text-sm font-medium text-gray-700"
                        >{$_("modules.inventory.movementsPage.reference")} / PO#</label
                    >
                    <input
                        type="text"
                        name="reference"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                </div>
            </div>

            {#if form?.error}
                <div
                    class="p-4 bg-red-50 text-red-700 rounded-md text-sm border border-red-100"
                >
                    {form.error}
                </div>
            {/if}

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <a
                    href="/app/inventory/movements"
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >{$_("modules.inventory.warehousesPage.cancel")}</a
                >
                <button
                    type="submit"
                    class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Save class="w-4 h-4" />
                    {$_("modules.inventory.movementsPage.saveBtn")}
                </button>
            </div>
        </form>
    </div>
</div>
