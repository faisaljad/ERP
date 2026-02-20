<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Edit2, MapPin, Building2 } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    interface Warehouse {
        id: string;
        name: string;
        location: string | null;
        branchId: string;
        branch: { name: string };
    }

    let { data, form } = $props();
    let showCreateModal = $state(false);
    let editingWarehouse = $state<Warehouse | null>(null);
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.inventory.warehousesPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.inventory.warehousesPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => {
                editingWarehouse = null;
                showCreateModal = true;
            }}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.inventory.warehousesPage.newWarehouse")}
        </button>
    </div>

    {#if showCreateModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {editingWarehouse
                        ? $_("modules.inventory.warehousesPage.editWarehouse")
                        : $_("modules.inventory.warehousesPage.addWarehouse")}
                </h2>
                <form
                    method="POST"
                    action="?/{editingWarehouse ? 'update' : 'create'}"
                    use:enhance
                >
                    {#if editingWarehouse}
                        <input
                            type="hidden"
                            name="id"
                            value={editingWarehouse.id}
                        />
                    {/if}
                    <div class="space-y-4">
                        <div>
                            <label
                                for="name"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.inventory.warehousesPage.name",
                                )}</label
                            >
                            <input
                                type="text"
                                name="name"
                                value={editingWarehouse?.name || ""}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>

                        <div>
                            <label
                                for="location"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.inventory.warehousesPage.location",
                                )}</label
                            >
                            <input
                                type="text"
                                name="location"
                                value={editingWarehouse?.location || ""}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>

                        <div>
                            <label
                                for="branchId"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.inventory.warehousesPage.branch",
                                )}</label
                            >
                            <select
                                name="branchId"
                                value={editingWarehouse?.branchId || ""}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            >
                                <option value="" disabled
                                    >{$_(
                                        "modules.inventory.warehousesPage.selectBranch",
                                    )}</option
                                >
                                {#each data.branches as branch}
                                    <option value={branch.id}
                                        >{branch.name}</option
                                    >
                                {/each}
                            </select>
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
                            >{$_(
                                "modules.inventory.warehousesPage.cancel",
                            )}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_(
                                "modules.inventory.warehousesPage.save",
                            )}</button
                        >
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.warehouses as warehouse}
            <div
                class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow relative group"
            >
                <div
                    class="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <button
                        onclick={() => {
                            editingWarehouse = warehouse;
                            showCreateModal = true;
                        }}
                        class="text-gray-400 hover:text-blue-600"
                    >
                        <Edit2 class="w-4 h-4" />
                    </button>
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <div class="p-3 bg-indigo-50 rounded-lg">
                        <Building2 class="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">
                            {warehouse.name}
                        </h3>
                        <span
                            class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                            >{warehouse.branch.name}</span
                        >
                    </div>
                </div>

                <div class="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin class="w-4 h-4 mt-0.5 shrink-0" />
                    <p>
                        {warehouse.location ||
                            $_("modules.inventory.warehousesPage.noLocation")}
                    </p>
                </div>
            </div>
        {/each}
        {#if data.warehouses.length === 0}
            <div
                class="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300"
            >
                {$_("modules.inventory.warehousesPage.noWarehouses")}
            </div>
        {/if}
    </div>
</div>
