<script lang="ts">
    import { _ } from "svelte-i18n";
    import { enhance } from "$app/forms";
    import {
        Search,
        FileText,
        CheckCircle,
        Eye,
        Calculator,
    } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props<{ data: PageData }>();
    let searchQuery = $state("");

    let filteredBills = $derived(
        data.bills.filter(
            (bill: any) =>
                bill.orderNumber
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                bill.vendor.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        ),
    );

    let selectedBill = $state<any>(null);
    let showDetailsModal = $state(false);

    function viewDetails(bill: any) {
        selectedBill = bill;
        showDetailsModal = true;
    }

    function closeDetailsModal() {
        showDetailsModal = false;
        selectedBill = null;
    }

    function formatCurrency(amount: number) {
        return new Intl.NumberFormat("en-JO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }

    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString();
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.purchasing.billsPage.title")}
            </h1>
            <p class="text-gray-500 mt-1">
                {$_("modules.purchasing.billsPage.subtitle")}
            </p>
        </div>
    </div>

    <!-- Actions Bar -->
    <div
        class="flex sm:flex-row flex-col gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
    >
        <div class="relative w-full sm:w-96">
            <Search
                class="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
                type="text"
                bind:value={searchQuery}
                placeholder={$_(
                    "modules.purchasing.billsPage.searchPlaceholder",
                )}
                class="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    </div>

    <!-- Bills Table -->
    <div
        class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right">
                <thead
                    class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200"
                >
                    <tr>
                        <th class="px-6 py-4"
                            >{$_("modules.purchasing.billsPage.orderRef")}</th
                        >
                        <th class="px-6 py-4"
                            >{$_("modules.purchasing.billsPage.vendor")}</th
                        >
                        <th class="px-6 py-4"
                            >{$_("modules.purchasing.billsPage.date")}</th
                        >
                        <th class="px-6 py-4"
                            >{$_("modules.purchasing.billsPage.amount")}</th
                        >
                        <th class="px-6 py-4"
                            >{$_("modules.purchasing.billsPage.status")}</th
                        >
                        <th class="px-6 py-4 text-center"
                            >{$_("modules.purchasing.billsPage.actions")}</th
                        >
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    {#each filteredBills as bill}
                        <tr class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <span class="font-medium text-gray-900"
                                    >{bill.orderNumber}</span
                                >
                            </td>
                            <td class="px-6 py-4">{bill.vendor.name}</td>
                            <td class="px-6 py-4"
                                >{formatDate(bill.updatedAt)}</td
                            >
                            <td class="px-6 py-4 font-medium"
                                >JD {formatCurrency(bill.total)}</td
                            >
                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {bill.status ===
                                    'BILLED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'}"
                                >
                                    {$_(
                                        `modules.purchasing.status.${bill.status}`,
                                    )}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    class="flex items-center justify-center gap-2"
                                >
                                    <button
                                        onclick={() => viewDetails(bill)}
                                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <Eye class="w-4 h-4" />
                                    </button>

                                    {#if bill.status === "RECEIVED"}
                                        <form
                                            method="POST"
                                            action="?/markAsBilled"
                                            use:enhance
                                        >
                                            <input
                                                type="hidden"
                                                name="orderId"
                                                value={bill.id}
                                            />
                                            <button
                                                type="submit"
                                                class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title={$_(
                                                    "modules.purchasing.billsPage.markBilled",
                                                )}
                                            >
                                                <CheckCircle class="w-4 h-4" />
                                            </button>
                                        </form>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td
                                colspan="6"
                                class="px-6 py-12 text-center text-gray-500"
                            >
                                <div
                                    class="flex flex-col items-center justify-center"
                                >
                                    <FileText
                                        class="w-12 h-12 text-gray-300 mb-4"
                                    />
                                    <p
                                        class="text-lg font-medium text-gray-900"
                                    >
                                        {$_(
                                            "modules.purchasing.billsPage.noBillsFound",
                                        )}
                                    </p>
                                    <p class="text-sm">
                                        {$_(
                                            "modules.purchasing.billsPage.noBillsFoundDesc",
                                        )}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Details Modal -->
{#if showDetailsModal && selectedBill}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
        <div
            class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
            <!-- Header -->
            <div
                class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"
            >
                <div>
                    <h2
                        class="text-lg font-bold text-gray-900 flex items-center gap-2"
                    >
                        <FileText class="w-5 h-5 text-gray-400" />
                        {$_("modules.purchasing.billsPage.billDetails")}
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        {selectedBill.orderNumber} • {selectedBill.vendor.name}
                    </p>
                </div>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                    onclick={closeDetailsModal}
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto">
                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div
                        class="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        <p class="text-sm text-gray-500 mb-1">
                            {$_("modules.purchasing.billsPage.vendor")}
                        </p>
                        <p class="font-medium text-gray-900">
                            {selectedBill.vendor.name}
                        </p>
                        <p class="text-sm text-gray-600">
                            {selectedBill.vendor.email || ""}
                        </p>
                    </div>
                    <div
                        class="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        <p class="text-sm text-gray-500 mb-1">
                            {$_("modules.purchasing.billsPage.status")}
                        </p>
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {selectedBill.status ===
                            'BILLED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'}"
                        >
                            {$_(
                                `modules.purchasing.status.${selectedBill.status}`,
                            )}
                        </span>
                    </div>
                </div>

                <div class="border rounded-lg overflow-hidden">
                    <table class="w-full text-sm text-left rtl:text-right">
                        <thead
                            class="bg-gray-50 text-gray-600 font-medium border-b"
                        >
                            <tr>
                                <th class="px-4 py-3"
                                    >{$_(
                                        "modules.purchasing.billsPage.item",
                                    )}</th
                                >
                                <th class="px-4 py-3"
                                    >{$_(
                                        "modules.purchasing.billsPage.qty",
                                    )}</th
                                >
                                <th class="px-4 py-3"
                                    >{$_(
                                        "modules.purchasing.billsPage.unitPrice",
                                    )}</th
                                >
                                <th class="px-4 py-3"
                                    >{$_(
                                        "modules.purchasing.billsPage.total",
                                    )}</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each selectedBill.lines as line}
                                <tr>
                                    <td class="px-4 py-3 font-medium"
                                        >{line.item.name}</td
                                    >
                                    <td class="px-4 py-3"
                                        >{line.receivedQty > 0
                                            ? line.receivedQty
                                            : line.quantity}
                                        {line.item.unit}</td
                                    >
                                    <td class="px-4 py-3"
                                        >JD {formatCurrency(line.unitPrice)}</td
                                    >
                                    <td class="px-4 py-3 font-medium"
                                        >JD {formatCurrency(line.total)}</td
                                    >
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div class="mt-6 flex justify-end">
                    <div
                        class="w-72 bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between text-gray-600">
                                <span
                                    >{$_(
                                        "modules.purchasing.billsPage.subtotal",
                                    )}</span
                                >
                                <span
                                    >JD {formatCurrency(
                                        selectedBill.subtotal,
                                    )}</span
                                >
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span
                                    >{$_(
                                        "modules.purchasing.billsPage.tax",
                                    )}</span
                                >
                                <span
                                    >JD {formatCurrency(selectedBill.tax)}</span
                                >
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span
                                    >{$_(
                                        "modules.purchasing.billsPage.discount",
                                    )}</span
                                >
                                <span
                                    >- JD {formatCurrency(
                                        selectedBill.discount,
                                    )}</span
                                >
                            </div>
                            <div
                                class="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-base"
                            >
                                <span
                                    >{$_(
                                        "modules.purchasing.billsPage.total",
                                    )}</span
                                >
                                <span
                                    >JD {formatCurrency(
                                        selectedBill.total,
                                    )}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3"
            >
                <button
                    type="button"
                    onclick={closeDetailsModal}
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    {$_("modules.purchasing.billsPage.close")}
                </button>
            </div>
        </div>
    </div>
{/if}
