<script lang="ts">
    import { _ } from "svelte-i18n";
    import { enhance } from "$app/forms";
    import { Plus, Search, Edit2, Phone, Mail, MapPin } from "lucide-svelte";
    import type { PageData } from "./$types";
    import type { Customer } from "@prisma/client";

    let { data } = $props<{ data: PageData }>();

    let isModalOpen = $state(false);
    let editingCustomer = $state<Customer | null>(null);
    let searchQuery = $state("");

    let filteredCustomers = $derived(
        data.customers.filter(
            (c: Customer) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.phone &&
                    c.phone
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                (c.email &&
                    c.email.toLowerCase().includes(searchQuery.toLowerCase())),
        ),
    );

    function openModal(customer: Customer | null = null) {
        editingCustomer = customer;
        isModalOpen = true;
    }

    function closeModal() {
        isModalOpen = false;
        editingCustomer = null;
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.sales.customersPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.sales.customersPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => openModal()}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.sales.customersPage.addCustomer")}
        </button>
    </div>

    <!-- Toolbar -->
    <div
        class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between"
    >
        <div class="relative flex-1 max-w-md">
            <Search
                class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
                type="text"
                bind:value={searchQuery}
                placeholder={$_("modules.inventory.itemsPage.search")}
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
        </div>
    </div>

    <!-- Customer Grid -->
    {#if filteredCustomers.length === 0}
        <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
        >
            <div
                class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
                <Search class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">
                {$_("modules.sales.customersPage.noCustomers")}
            </h3>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredCustomers as customer}
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative group"
                >
                    <button
                        onclick={() => openModal(customer)}
                        class="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Edit2 class="w-4 h-4" />
                    </button>

                    <div class="flex items-start gap-4 mb-4">
                        <div
                            class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl uppercase"
                        >
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900">
                                {customer.name}
                            </h3>
                            {#if customer.taxId}
                                <span class="text-xs text-gray-500"
                                    >Tax ID: {customer.taxId}</span
                                >
                            {/if}
                        </div>
                    </div>

                    <div class="space-y-2 mt-auto">
                        {#if customer.phone}
                            <div
                                class="flex items-center gap-2 text-sm text-gray-600"
                            >
                                <Phone class="w-4 h-4 text-gray-400" />
                                <span dir="ltr">{customer.phone}</span>
                            </div>
                        {/if}
                        {#if customer.email}
                            <div
                                class="flex items-center gap-2 text-sm text-gray-600"
                            >
                                <Mail class="w-4 h-4 text-gray-400" />
                                <span>{customer.email}</span>
                            </div>
                        {/if}
                        {#if customer.address}
                            <div
                                class="flex items-center gap-2 text-sm text-gray-600"
                            >
                                <MapPin
                                    class="w-4 h-4 text-gray-400 shrink-0"
                                />
                                <span class="truncate">{customer.address}</span>
                            </div>
                        {/if}
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
                    {editingCustomer
                        ? $_("modules.sales.customersPage.editCustomer")
                        : $_("modules.sales.customersPage.newCustomer")}
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
                action="?/{editingCustomer ? 'update' : 'create'}"
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
                {#if editingCustomer}
                    <input type="hidden" name="id" value={editingCustomer.id} />
                {/if}

                <div>
                    <label
                        for="name"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {$_("modules.sales.customersPage.name")} *
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={editingCustomer?.name || ""}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label
                        for="phone"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {$_("modules.sales.customersPage.phone")}
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        dir="ltr"
                        value={editingCustomer?.phone || ""}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                    />
                </div>

                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {$_("modules.sales.customersPage.email")}
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        dir="ltr"
                        value={editingCustomer?.email || ""}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                    />
                </div>

                <div>
                    <label
                        for="taxId"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {$_("modules.sales.customersPage.taxId")}
                    </label>
                    <input
                        type="text"
                        name="taxId"
                        id="taxId"
                        dir="ltr"
                        value={editingCustomer?.taxId || ""}
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label
                        for="address"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {$_("modules.sales.customersPage.address")}
                    </label>
                    <textarea
                        name="address"
                        id="address"
                        rows="2"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        >{editingCustomer?.address || ""}</textarea
                    >
                </div>

                <div
                    class="pt-4 flex justify-end gap-3 border-t border-gray-100"
                >
                    <button
                        type="button"
                        onclick={closeModal}
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {$_("modules.sales.customersPage.cancel")}
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {$_("modules.sales.customersPage.save")}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
