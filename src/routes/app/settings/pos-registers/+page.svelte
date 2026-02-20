<script lang="ts">
    import { _ } from "svelte-i18n";
    import { enhance } from "$app/forms";
    import { Plus, Edit2, MonitorPlay, Building2, Server } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props<{ data: PageData }>();

    let isModalOpen = $state(false);
    let editingRegister = $state<any>(null);

    function openModal(register: any = null) {
        editingRegister = register;
        isModalOpen = true;
    }

    function closeModal() {
        isModalOpen = false;
        editingRegister = null;
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.settings.posRegistersPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.settings.posRegistersPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => openModal()}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.settings.posRegistersPage.addRegister")}
        </button>
    </div>

    <!-- Registers Grid -->
    {#if data.registers.length === 0}
        <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
        >
            <div
                class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
                <MonitorPlay class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">
                {$_("modules.settings.posRegistersPage.noRegisters")}
            </h3>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.registers as register}
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative group"
                >
                    <button
                        onclick={() => openModal(register)}
                        class="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Edit2 class="w-4 h-4" />
                    </button>

                    <div class="flex items-start gap-4 mb-4">
                        <div
                            class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl uppercase"
                        >
                            <Server class="w-6 h-6" />
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900">
                                {register.name}
                            </h3>
                            <div class="mt-1 flex items-center gap-2">
                                <span
                                    class={`px-2 py-0.5 text-xs font-medium rounded-full ${register.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                    {register.isActive
                                        ? $_(
                                              "modules.settings.posRegistersPage.active",
                                          )
                                        : $_(
                                              "modules.settings.posRegistersPage.inactive",
                                          )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2 mt-auto pt-4 border-t border-gray-50">
                        <div
                            class="flex items-center gap-2 text-sm text-gray-600"
                        >
                            <Building2 class="w-4 h-4 text-gray-400 shrink-0" />
                            <span class="truncate">{register.branch.name}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Add/Edit Modal -->
{#if isModalOpen}
    <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
        <div
            class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        >
            <div
                class="px-6 py-4 border-b border-gray-100 flex justify-between items-center"
            >
                <h2 class="text-xl font-bold text-gray-900">
                    {editingRegister
                        ? $_("modules.settings.posRegistersPage.editRegister")
                        : $_("modules.settings.posRegistersPage.newRegister")}
                </h2>
                <button
                    onclick={closeModal}
                    class="text-gray-400 hover:text-gray-600"
                >
                    &times;
                </button>
            </div>

            <form
                method="POST"
                action="?/{editingRegister ? 'update' : 'create'}"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === "success") {
                            closeModal();
                        }
                        await update();
                    };
                }}
                class="p-6 space-y-4"
            >
                {#if editingRegister}
                    <input type="hidden" name="id" value={editingRegister.id} />
                {/if}

                <div>
                    <label
                        for="name"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {$_("modules.settings.posRegistersPage.name")} *
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={editingRegister?.name || ""}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label
                        for="branchId"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {$_("modules.settings.posRegistersPage.branch")} *
                    </label>
                    <select
                        name="branchId"
                        id="branchId"
                        required
                        value={editingRegister?.branchId || ""}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="" disabled
                            >{$_(
                                "modules.settings.posRegistersPage.selectBranch",
                            )}</option
                        >
                        {#each data.branches as branch}
                            <option value={branch.id}>{branch.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={editingRegister
                            ? editingRegister.isActive
                            : true}
                        class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                        for="isActive"
                        class="text-sm font-medium text-gray-700"
                    >
                        {$_("modules.settings.posRegistersPage.active")}
                    </label>
                </div>

                <div
                    class="pt-4 flex justify-end gap-3 border-t border-gray-100"
                >
                    <button
                        type="button"
                        onclick={closeModal}
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {$_("modules.settings.posRegistersPage.cancel")}
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {$_("modules.settings.posRegistersPage.save")}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
