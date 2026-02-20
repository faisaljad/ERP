<script lang="ts">
    import { Plus, Eye } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data } = $props();
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.accounting.journals.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.accounting.journals.subtitle")}
            </p>
        </div>
        <a
            href="/app/accounting/journals/create"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.accounting.journals.newEntry")}
        </a>
    </div>

    <div
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.journals.date")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.journals.reference")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.journals.description")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.journals.totalAmount")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.journals.actions")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.journals as journal}
                    <tr class="hover:bg-gray-50">
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                            {new Date(journal.date).toLocaleDateString()}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {journal.reference || "-"}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                            {journal.description || "No description"}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-mono"
                        >
                            {journal.totalAmount.toFixed(2)}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                        >
                            <a
                                href="/app/accounting/journals/{journal.id}"
                                class="text-blue-600 hover:text-blue-900"
                            >
                                <Eye class="w-4 h-4" />
                            </a>
                        </td>
                    </tr>
                {/each}
                {#if data.journals.length === 0}
                    <tr>
                        <td
                            colspan="5"
                            class="px-6 py-12 text-center text-gray-500"
                        >
                            {$_("modules.accounting.journals.noEntries")}
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
