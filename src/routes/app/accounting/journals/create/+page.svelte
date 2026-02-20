<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Trash2, ArrowLeft, Save } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data, form } = $props();

    // Use Svelte 5 state
    let lines = $state([
        { id: 1, accountId: "", debit: 0, credit: 0, description: "" },
        { id: 2, accountId: "", debit: 0, credit: 0, description: "" },
    ]);

    // Derived values must involve state
    let totalDebit = $derived(
        lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0),
    );
    let totalCredit = $derived(
        lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0),
    );
    let isBalanced = $derived(Math.abs(totalDebit - totalCredit) < 0.001);

    function addLine() {
        lines.push({
            id: Date.now(),
            accountId: "",
            debit: 0,
            credit: 0,
            description: "",
        });
    }

    function removeLine(index: number) {
        if (lines.length > 2) {
            lines.splice(index, 1);
        }
    }

    function handleDebitInput(line: any) {
        line.credit = 0;
    }

    function handleCreditInput(line: any) {
        line.debit = 0;
    }
</script>

<div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a
                href="/app/accounting/journals"
                class="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
                <ArrowLeft class="w-5 h-5" />
            </a>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.accounting.journals.createTitle")}
            </h1>
        </div>
    </div>

    <form method="POST" use:enhance class="space-y-6">
        <!-- Header -->
        <div
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            <div>
                <label
                    for="date"
                    class="block text-sm font-medium text-gray-700"
                    >{$_("modules.accounting.journals.date")}</label
                >
                <input
                    type="date"
                    name="date"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
            </div>
            <div>
                <label
                    for="reference"
                    class="block text-sm font-medium text-gray-700"
                    >{$_("modules.accounting.journals.reference")}</label
                >
                <input
                    type="text"
                    name="reference"
                    placeholder="#JE-001"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
            </div>
            <div class="md:col-span-3">
                <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                    >{$_("modules.accounting.journals.description")}</label
                >
                <input
                    type="text"
                    name="description"
                    placeholder="Opening Balance, Invoice Payment, etc."
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
            </div>
        </div>

        <!-- Lines -->
        <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div
                class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50"
            >
                <h3 class="text-lg font-medium text-gray-900">
                    {$_("modules.accounting.journals.lines")}
                </h3>
                <button
                    type="button"
                    onclick={addLine}
                    class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-white px-3 py-1 rounded border border-gray-200 shadow-sm"
                >
                    <Plus class="w-4 h-4" />
                    {$_("modules.accounting.journals.addLine")}
                </button>
            </div>

            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                            >{$_("modules.accounting.journals.account")}</th
                        >
                        <th
                            class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >{$_("modules.accounting.journals.description")}</th
                        >
                        <th
                            class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                            >{$_("modules.accounting.journals.debit")}</th
                        >
                        <th
                            class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                            >{$_("modules.accounting.journals.credit")}</th
                        >
                        <th class="px-3 py-3 w-10"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    {#each lines as line, i}
                        <tr>
                            <td class="px-3 py-2">
                                <select
                                    name="accountId"
                                    bind:value={line.accountId}
                                    required
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                                >
                                    <option value="" disabled
                                        >{$_(
                                            "modules.accounting.journals.account",
                                        )}</option
                                    >
                                    {#each data.accounts as account}
                                        <option value={account.id}
                                            >{account.code} - {account.name}</option
                                        >
                                    {/each}
                                </select>
                            </td>
                            <td class="px-3 py-2">
                                <input
                                    type="text"
                                    name="lineDescription"
                                    bind:value={line.description}
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                                    placeholder={$_(
                                        "modules.accounting.journals.lineDescription",
                                    )}
                                />
                            </td>
                            <td class="px-3 py-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="debit"
                                    bind:value={line.debit}
                                    oninput={() => handleDebitInput(line)}
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm text-right font-mono"
                                />
                            </td>
                            <td class="px-3 py-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="credit"
                                    bind:value={line.credit}
                                    oninput={() => handleCreditInput(line)}
                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm text-right font-mono"
                                />
                            </td>
                            <td class="px-3 py-2 text-center">
                                {#if lines.length > 2}
                                    <button
                                        type="button"
                                        onclick={() => removeLine(i)}
                                        class="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                        title="Remove line"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
                <tfoot class="bg-gray-50 font-bold border-t border-gray-200">
                    <tr>
                        <td
                            colspan="2"
                            class="px-3 py-3 text-right text-gray-700"
                            >{$_("modules.accounting.journals.total")}</td
                        >
                        <td
                            class="px-3 py-3 text-right font-mono {isBalanced
                                ? 'text-green-600'
                                : 'text-red-600'}">{totalDebit.toFixed(2)}</td
                        >
                        <td
                            class="px-3 py-3 text-right font-mono {isBalanced
                                ? 'text-green-600'
                                : 'text-red-600'}">{totalCredit.toFixed(2)}</td
                        >
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            {#if !isBalanced}
                <div
                    class="px-6 py-3 bg-red-50 text-red-700 text-sm flex justify-center items-center font-medium border-t border-red-100"
                >
                    <span
                        >{$_("modules.accounting.journals.balanceError")} Difference:
                        <span class="font-mono font-bold"
                            >{Math.abs(totalDebit - totalCredit).toFixed(
                                2,
                            )}</span
                        ></span
                    >
                </div>
            {/if}

            {#if form?.error}
                <div
                    class="px-6 py-3 bg-red-50 text-red-700 text-sm text-center border-t border-red-100 font-medium"
                >
                    {form.error}
                </div>
            {/if}
        </div>

        <div class="flex justify-end gap-3 pt-4">
            <a
                href="/app/accounting/journals"
                class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 bg-white font-medium shadow-sm transition-colors"
                >{$_("modules.accounting.journals.cancel")}</a
            >
            <button
                type="submit"
                disabled={!isBalanced || totalDebit === 0}
                class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
            >
                <Save class="w-4 h-4" />
                {$_("modules.accounting.journals.save")}
            </button>
        </div>
    </form>
</div>
