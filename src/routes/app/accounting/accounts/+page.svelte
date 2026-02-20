<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Edit2, Trash2, Folder, FileText } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    interface Account {
        id: string;
        code: string;
        name: string;
        type: string;
        parentId: string | null;
        description: string | null;
        childrenCount: number;
        depth: number;
    }

    let { data, form } = $props();
    let showCreateModal = $state(false);
    let editingAccount: Account | null = $state(null);

    // Flattened tree with depth is passed from server
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.accounting.accounts.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.accounting.accounts.subtitle")}
            </p>
        </div>
        <button
            onclick={() => {
                editingAccount = null;
                showCreateModal = true;
            }}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.accounting.accounts.addAccount")}
        </button>
    </div>

    {#if showCreateModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {editingAccount
                        ? $_("modules.accounting.accounts.editAccount")
                        : $_("modules.accounting.accounts.addAccount")}
                </h2>
                <form
                    method="POST"
                    action="?/{editingAccount ? 'update' : 'create'}"
                    use:enhance
                >
                    {#if editingAccount}
                        <input
                            type="hidden"
                            name="id"
                            value={editingAccount.id}
                        />
                    {/if}
                    <div class="space-y-4">
                        <div>
                            <label
                                for="code"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.accounting.accounts.code")}</label
                            >
                            <input
                                type="text"
                                name="code"
                                value={editingAccount?.code || ""}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label
                                for="name"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.accounting.accounts.name")}</label
                            >
                            <input
                                type="text"
                                name="name"
                                value={editingAccount?.name || ""}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="type"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.accounting.accounts.type",
                                    )}</label
                                >
                                <select
                                    name="type"
                                    value={editingAccount?.type || "ASSET"}
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                >
                                    <option value="ASSET"
                                        >{$_(
                                            "modules.accounting.accounts.types.ASSET",
                                        )}</option
                                    >
                                    <option value="LIABILITY"
                                        >{$_(
                                            "modules.accounting.accounts.types.LIABILITY",
                                        )}</option
                                    >
                                    <option value="EQUITY"
                                        >{$_(
                                            "modules.accounting.accounts.types.EQUITY",
                                        )}</option
                                    >
                                    <option value="REVENUE"
                                        >{$_(
                                            "modules.accounting.accounts.types.REVENUE",
                                        )}</option
                                    >
                                    <option value="EXPENSE"
                                        >{$_(
                                            "modules.accounting.accounts.types.EXPENSE",
                                        )}</option
                                    >
                                </select>
                            </div>
                            <div>
                                <label
                                    for="parentId"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.accounting.accounts.parent",
                                    )}</label
                                >
                                <select
                                    name="parentId"
                                    value={editingAccount?.parentId || ""}
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                >
                                    <option value=""
                                        >{$_(
                                            "modules.accounting.accounts.none",
                                        )}</option
                                    >
                                    {#each data.linearAccounts as acc}
                                        {#if !editingAccount || acc.id !== editingAccount.id}
                                            <option value={acc.id}>
                                                {acc.code} - {acc.name}
                                            </option>
                                        {/if}
                                    {/each}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                for="description"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.accounting.accounts.description",
                                )}</label
                            >
                            <textarea
                                name="description"
                                rows="2"
                                value={editingAccount?.description || ""}
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
                            >{$_("modules.accounting.journals.cancel")}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_("modules.accounting.journals.save")}</button
                        >
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.accounts.code")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.accounts.name")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.accounts.type")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.accounting.accounts.actions")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.linearAccounts as account}
                    <tr class="hover:bg-gray-50">
                        <td
                            class="px-6 py-2 whitespace-nowrap text-sm text-gray-500 font-mono"
                        >
                            {account.code}
                        </td>
                        <td class="px-6 py-2 whitespace-nowrap">
                            <div
                                class="flex items-center"
                                style="padding-inline-start: {account.depth *
                                    20}px"
                            >
                                {#if account.childrenCount > 0}
                                    <Folder
                                        class="w-4 h-4 text-blue-400 me-2"
                                    />
                                {:else}
                                    <FileText
                                        class="w-4 h-4 text-gray-400 me-2"
                                    />
                                {/if}
                                <div class="text-sm font-medium text-gray-900">
                                    {account.name}
                                </div>
                            </div>
                        </td>
                        <td
                            class="px-6 py-2 whitespace-nowrap text-sm text-gray-500"
                        >
                            <span
                                class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                            >
                                {$_(
                                    `modules.accounting.accounts.types.${account.type}`,
                                )}
                            </span>
                        </td>
                        <td
                            class="px-6 py-2 whitespace-nowrap text-end text-sm font-medium"
                        >
                            <button
                                onclick={() => {
                                    editingAccount = account;
                                    showCreateModal = true;
                                }}
                                class="text-blue-600 hover:text-blue-900 me-3"
                            >
                                <Edit2 class="w-4 h-4" />
                            </button>
                            <form
                                action="?/delete"
                                method="POST"
                                use:enhance
                                class="inline-block"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={account.id}
                                />
                                <button
                                    type="submit"
                                    class="text-red-600 hover:text-red-900"
                                    disabled={account.childrenCount > 0}
                                >
                                    <Trash2
                                        class="w-4 h-4 {account.childrenCount >
                                        0
                                            ? 'opacity-30 cursor-not-allowed'
                                            : ''}"
                                    />
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
