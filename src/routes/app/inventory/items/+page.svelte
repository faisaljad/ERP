<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Edit2, Package, Search } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    import type { Category } from "@prisma/client";

    interface Item {
        id: string;
        sku: string;
        name: string;
        unit: string;
        reorderLevel: number;
        categoryId: string | null;
        description: string | null;
        category?: { name: string } | null;
    }

    let { data, form } = $props();
    let showCreateModal = $state(false);
    let editingItem = $state<Item | null>(null);
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.inventory.itemsPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.inventory.itemsPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => {
                editingItem = null;
                showCreateModal = true;
            }}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.inventory.itemsPage.newItem")}
        </button>
    </div>

    {#if showCreateModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {editingItem
                        ? $_("modules.inventory.itemsPage.editItem")
                        : $_("modules.inventory.itemsPage.newItem")}
                </h2>
                <form
                    method="POST"
                    action="?/{editingItem ? 'update' : 'create'}"
                    use:enhance
                >
                    {#if editingItem}
                        <input type="hidden" name="id" value={editingItem.id} />
                    {/if}
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="sku"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.inventory.itemsPage.sku",
                                    )}</label
                                >
                                <input
                                    type="text"
                                    name="sku"
                                    value={editingItem?.sku || ""}
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                            <div>
                                <label
                                    for="name"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.inventory.itemsPage.name",
                                    )}</label
                                >
                                <input
                                    type="text"
                                    name="name"
                                    value={editingItem?.name || ""}
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="unit"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.inventory.itemsPage.unit",
                                    )}</label
                                >
                                <select
                                    name="unit"
                                    value={editingItem?.unit || "pcs"}
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                >
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="m">Meter (m)</option>
                                    <option value="l">Liter (l)</option>
                                    <option value="box">Box</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    for="reorderLevel"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.inventory.itemsPage.reorderLevel",
                                    )}</label
                                >
                                <input
                                    type="number"
                                    name="reorderLevel"
                                    value={editingItem?.reorderLevel ?? 10}
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                for="categoryId"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.inventory.itemsPage.category",
                                )}</label
                            >
                            <select
                                name="categoryId"
                                value={editingItem?.categoryId || ""}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            >
                                <option value=""
                                    >{$_(
                                        "modules.inventory.itemsPage.selectCategory",
                                    )}</option
                                >
                                {#each data.categories as cat}
                                    <option value={cat.id}>{cat.name}</option>
                                {/each}
                            </select>
                        </div>

                        <div>
                            <label
                                for="description"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.inventory.itemsPage.description",
                                )}</label
                            >
                            <textarea
                                name="description"
                                rows="2"
                                value={editingItem?.description || ""}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            ></textarea>
                        </div>
                    </div>

                    {#if form?.error}
                        <p class="text-red-500 text-sm mt-2">{form.error}</p>
                    {/if}

                    <div class="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onclick={() => (showCreateModal = false)}
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >{$_("modules.inventory.itemsPage.cancel")}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_("modules.inventory.itemsPage.save")}</button
                        >
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
        <div
            class="p-4 border-b border-gray-100 flex items-center justify-between"
        >
            <div class="relative max-w-xs w-full">
                <div
                    class="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none"
                >
                    <Search class="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={$_("modules.inventory.itemsPage.search")}
                    class="block w-full ps-10 pe-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
        </div>

        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.itemsPage.sku")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.itemsPage.name")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.itemsPage.category")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.itemsPage.unit")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.inventory.itemsPage.actions")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.items as item}
                    <tr class="hover:bg-gray-50">
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono"
                        >
                            {item.sku}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                        >
                            {item.name}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {item.category?.name || "-"}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {item.unit}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium"
                        >
                            <button
                                onclick={() => {
                                    editingItem = item;
                                    showCreateModal = true;
                                }}
                                class="text-blue-600 hover:text-blue-900 me-3"
                            >
                                <Edit2 class="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                {/each}
                {#if data.items.length === 0}
                    <tr>
                        <td
                            colspan="5"
                            class="px-6 py-12 text-center text-gray-500"
                        >
                            {$_("modules.inventory.itemsPage.noItems")}
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
