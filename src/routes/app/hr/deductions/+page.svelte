<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Trash2, Percent, DollarSign } from "lucide-svelte";
    import type { DeductionRule } from "@prisma/client";
    import { _ } from "svelte-i18n";

    let { data, form } = $props();
    let showCreateModal = $state(false);
    let editingRule = $state<DeductionRule | null>(null);
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.hr.deductionsPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.hr.deductionsPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => {
                editingRule = null;
                showCreateModal = true;
            }}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.hr.deductionsPage.addRule")}
        </button>
    </div>

    <!-- Modal -->
    {#if showCreateModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {$_("modules.hr.deductionsPage.newRule")}
                </h2>
                <form method="POST" action="?/create" use:enhance>
                    <div class="space-y-4">
                        <div>
                            <label
                                for="name"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.hr.deductionsPage.ruleName",
                                )}</label
                            >
                            <input
                                type="text"
                                name="name"
                                placeholder={$_(
                                    "modules.hr.deductionsPage.placeholderName",
                                )}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label
                                for="type"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.deductionsPage.type")}</label
                            >
                            <select
                                name="type"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            >
                                <option value="PERCENTAGE"
                                    >{$_(
                                        "modules.hr.deductionsPage.types.PERCENTAGE",
                                    )}</option
                                >
                                <option value="FIXED"
                                    >{$_(
                                        "modules.hr.deductionsPage.types.FIXED",
                                    )}</option
                                >
                            </select>
                        </div>
                        <div>
                            <label
                                for="value"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.deductionsPage.value")}</label
                            >
                            <input
                                type="number"
                                name="value"
                                step="0.01"
                                placeholder={$_(
                                    "modules.hr.deductionsPage.placeholderValue",
                                )}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                            <p class="text-xs text-gray-500 mt-1">
                                {$_("modules.hr.deductionsPage.helpValue")}
                            </p>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onclick={() => (showCreateModal = false)}
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >{$_("modules.hr.deductionsPage.cancel")}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_("modules.hr.deductionsPage.save")}</button
                        >
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <!-- List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.rules as rule}
            <div
                class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group"
            >
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-red-50 rounded-lg">
                            {#if rule.type === "PERCENTAGE"}
                                <Percent class="w-5 h-5 text-red-600" />
                            {:else}
                                <DollarSign class="w-5 h-5 text-red-600" />
                            {/if}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900">{rule.name}</h3>
                            <p class="text-sm text-gray-500">{rule.type}</p>
                        </div>
                    </div>
                    <form method="POST" action="?/delete" use:enhance>
                        <input type="hidden" name="id" value={rule.id} />
                        <button
                            type="submit"
                            class="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </form>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-50">
                    <p class="text-2xl font-bold text-gray-900">
                        {rule.type === "PERCENTAGE"
                            ? `${(Number(rule.value) * 100).toFixed(1)}%`
                            : Number(rule.value).toFixed(2)}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                        {$_("modules.hr.deductionsPage.perMonth")}
                    </p>
                </div>
            </div>
        {/each}
        {#if data.rules.length === 0}
            <div
                class="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300"
            >
                {$_("modules.hr.deductionsPage.noRules")}
            </div>
        {/if}
    </div>
</div>
