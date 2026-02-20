<script lang="ts">
    import { _ } from "svelte-i18n";
    import { enhance } from "$app/forms";
    import {
        Search,
        Building2,
        Plus,
        Edit2,
        MapPin,
        Phone,
        Mail,
        FileText,
        ChevronRight,
    } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props<{ data: PageData }>();

    let searchQuery = $state("");
    let isModalOpen = $state(false);
    let editingVendor = $state<any>(null);

    let filteredVendors = $derived(
        data.vendors.filter(
            (vendor: any) =>
                vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (vendor.email &&
                    vendor.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                (vendor.phone && vendor.phone.includes(searchQuery)),
        ),
    );

    function openModal(vendor: any = null) {
        editingVendor = vendor;
        isModalOpen = true;
    }

    function closeModal() {
        isModalOpen = false;
        editingVendor = null;
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <!-- Hardcoded initially, will map to i18n keys later -->
            <h1
                class="text-2xl font-bold text-gray-900 flex items-center gap-2"
            >
                <Building2 class="w-6 h-6 text-blue-600" />
                Vendors
            </h1>
            <p class="text-gray-500 mt-1">Manage your suppliers and vendors.</p>
        </div>
        <button
            onclick={() => openModal()}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            Add Vendor
        </button>
    </div>

    <!-- Toolbar -->
    <div
        class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between"
    >
        <div class="relative flex-1 max-w-md">
            <Search
                class="w-5 h-5 text-gray-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2"
            />
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search vendors..."
                class="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
        </div>
    </div>

    <!-- Vendor Grid -->
    {#if filteredVendors.length === 0}
        <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
        >
            <div class="flex flex-col items-center justify-center">
                <Building2 class="w-12 h-12 text-gray-300 mb-3" />
                <p class="text-base font-medium text-gray-900">
                    No vendors found
                </p>
                <p class="text-gray-500 mt-1">
                    Add a new vendor to get started.
                </p>
            </div>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each filteredVendors as vendor}
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-gray-900 text-lg">
                                    {vendor.name}
                                </h3>
                                {#if vendor.contact}
                                    <p class="text-sm text-gray-500 mt-0.5">
                                        Contact: {vendor.contact}
                                    </p>
                                {/if}
                            </div>
                            <button
                                onclick={() => openModal(vendor)}
                                class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Edit2 class="w-4 h-4" />
                            </button>
                        </div>

                        <div class="space-y-2 mt-4 text-sm text-gray-600">
                            {#if vendor.email}
                                <div class="flex items-center gap-2">
                                    <Mail
                                        class="w-4 h-4 text-gray-400 shrink-0"
                                    />
                                    <span class="truncate">{vendor.email}</span>
                                </div>
                            {/if}
                            {#if vendor.phone}
                                <div class="flex items-center gap-2">
                                    <Phone
                                        class="w-4 h-4 text-gray-400 shrink-0"
                                    />
                                    <span>{vendor.phone}</span>
                                </div>
                            {/if}
                            {#if vendor.taxId}
                                <div class="flex items-center gap-2">
                                    <FileText
                                        class="w-4 h-4 text-gray-400 shrink-0"
                                    />
                                    <span>Tax ID: {vendor.taxId}</span>
                                </div>
                            {/if}
                            {#if vendor.address}
                                <div
                                    class="flex items-start gap-2 pt-1 border-t border-gray-50 mt-3"
                                >
                                    <MapPin
                                        class="w-4 h-4 text-gray-400 shrink-0 mt-0.5"
                                    />
                                    <span class="line-clamp-2"
                                        >{vendor.address}</span
                                    >
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div
                        class="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center text-sm"
                    >
                        <span
                            class="text-gray-500 font-medium cursor-pointer hover:text-blue-600 flex items-center gap-1"
                        >
                            View Purchase Orders
                            <ChevronRight class="w-4 h-4 rtl:rotate-180" />
                        </span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Modal -->
{#if isModalOpen}
    <div
        class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4"
    >
        <div
            class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        >
            <div
                class="p-6 border-b border-gray-100 flex justify-between items-center"
            >
                <h2 class="text-xl font-bold text-gray-900">
                    {editingVendor ? "Edit Vendor" : "Add Vendor"}
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
                action={editingVendor ? "?/update" : "?/create"}
                use:enhance={() => {
                    return async ({ update }) => {
                        await update();
                        closeModal();
                    };
                }}
                class="p-6 space-y-4"
            >
                {#if editingVendor}
                    <input type="hidden" name="id" value={editingVendor.id} />
                {/if}

                <div>
                    <label
                        for="name"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Company / Vendor Name*
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={editingVendor?.name || ""}
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label
                        for="contact"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Contact Person
                    </label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={editingVendor?.contact || ""}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="phone"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={editingVendor?.phone || ""}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={editingVendor?.email || ""}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label
                        for="taxId"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Tax ID
                    </label>
                    <input
                        type="text"
                        id="taxId"
                        name="taxId"
                        value={editingVendor?.taxId || ""}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label
                        for="address"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        >{editingVendor?.address || ""}</textarea
                    >
                </div>

                <div class="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onclick={closeModal}
                        class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                    >
                        {editingVendor ? "Save Changes" : "Create Vendor"}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
