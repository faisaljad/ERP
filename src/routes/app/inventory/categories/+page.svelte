<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Tag, Edit2 } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    import type { Category } from "@prisma/client";

    let { data, form } = $props();
    let showCreateModal = $state(false);
    let editingCategory = $state<Category | null>(null);
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.inventory.categoriesPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.inventory.categoriesPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => {
                editingCategory = null;
                showCreateModal = true;
            }}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.inventory.categoriesPage.newCategory")}
        </button>
    </div>

    {#if showCreateModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {editingCategory
                        ? $_("modules.inventory.categoriesPage.editCategory")
                        : $_("modules.inventory.categoriesPage.addCategory")}
                </h2>
                <form
                    method="POST"
                    action="?/{editingCategory ? 'update' : 'create'}"
                    use:enhance
                >
                    {#if editingCategory}
                        <input
                            type="hidden"
                            name="id"
                            value={editingCategory.id}
                        />
                    {/if}
                    <div class="space-y-4">
                        <div>
                            <label
                                for="name"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.inventory.categoriesPage.name",
                                )}</label
                            >
                            <input
                                type="text"
                                name="name"
                                value={editingCategory?.name || ""}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
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
                                "modules.inventory.categoriesPage.cancel",
                            )}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_(
                                "modules.inventory.categoriesPage.save",
                            )}</button
                        >
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each data.categories as category}
            <div
                class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow flex items-center justify-between group"
            >
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-50 rounded-lg">
                        <Tag class="w-5 h-5 text-blue-600" />
                    </div>
                    <span class="font-medium text-gray-900"
                        >{category.name}</span
                    >
                </div>
                <button
                    onclick={() => {
                        editingCategory = category;
                        showCreateModal = true;
                    }}
                    class="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Edit2 class="w-4 h-4" />
                </button>
            </div>
        {/each}
        {#if data.categories.length === 0}
            <div
                class="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300"
            >
                {$_("modules.inventory.categoriesPage.noCategories")}
            </div>
        {/if}
    </div>
</div>
