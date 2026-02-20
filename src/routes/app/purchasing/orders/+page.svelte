<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        Search,
        ShoppingBag,
        Plus,
        Eye,
        Truck,
        CheckCircle,
        Clock,
        FileText,
    } from "lucide-svelte";
    import type { PageData } from "./$types";
    import type { Prisma } from "@prisma/client";

    let { data } = $props<{ data: PageData }>();

    type POWithRelations = Prisma.PurchaseOrderGetPayload<{
        include: { vendor: true; branch: true };
    }>;

    let purchaseOrders = $derived(data.purchaseOrders as POWithRelations[]);

    let searchQuery = $state("");

    let selectedOrder = $state<any>(null);
    let showDetailsModal = $state(false);

    function viewDetails(order: any) {
        selectedOrder = order;
        showDetailsModal = true;
    }

    function closeDetailsModal() {
        showDetailsModal = false;
        selectedOrder = null;
    }

    let filteredOrders = $derived(
        purchaseOrders.filter(
            (order) =>
                order.orderNumber
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (order.vendor?.name &&
                    order.vendor.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())),
        ),
    );

    const formatCurrency = (amount: any) =>
        parseFloat(amount || "0").toFixed(2);
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "RECEIVED":
                return "bg-green-100 text-green-800";
            case "BILLED":
                return "bg-purple-100 text-purple-800";
            case "ORDERED":
                return "bg-blue-100 text-blue-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "DRAFT":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "RECEIVED":
                return CheckCircle;
            case "ORDERED":
                return Truck;
            case "BILLED":
                return FileText;
            case "DRAFT":
                return Clock;
            default:
                return ShoppingBag;
        }
    };
</script>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <!-- Hardcoded English labels for now -->
            <h1
                class="text-2xl font-bold text-gray-900 flex items-center gap-2"
            >
                <ShoppingBag class="w-6 h-6 text-blue-600" />
                Purchase Orders
            </h1>
            <p class="text-gray-500">
                Manage your suppliers orders and incoming stock.
            </p>
        </div>
        <a
            href="/app/purchasing/orders/create"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            Create PO
        </a>
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
                placeholder="Search by PO number or vendor..."
                class="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
        </div>
    </div>

    <!-- Table -->
    <div
        class="bg-white border text-left border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead
                    class="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200"
                >
                    <tr>
                        <th class="px-6 py-4 font-medium">PO Number</th>
                        <th class="px-6 py-4 font-medium">Date</th>
                        <th class="px-6 py-4 font-medium">Vendor</th>
                        <th class="px-6 py-4 font-medium">Branch</th>
                        <th class="px-6 py-4 font-medium">Total</th>
                        <th class="px-6 py-4 font-medium">Status</th>
                        <th
                            class="px-6 py-4 font-medium text-right rtl:text-left"
                            >Actions</th
                        >
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    {#if filteredOrders.length === 0}
                        <tr>
                            <td
                                colspan="7"
                                class="px-6 py-12 text-center text-gray-500"
                            >
                                <div
                                    class="flex flex-col items-center justify-center"
                                >
                                    <ShoppingBag
                                        class="w-12 h-12 text-gray-300 mb-3"
                                    />
                                    <p
                                        class="text-base font-medium text-gray-900"
                                    >
                                        No purchase orders found
                                    </p>
                                    <p class="mt-1">
                                        Try adjusting your search or create a
                                        new PO.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        {#each filteredOrders as order}
                            {@const StatusIcon = getStatusIcon(order.status)}
                            <tr
                                class="hover:bg-gray-50 transition-colors group"
                            >
                                <td class="px-6 py-4 font-medium text-gray-900">
                                    {order.orderNumber}
                                </td>
                                <td class="px-6 py-4 text-gray-600">
                                    {formatDate(order.createdAt.toString())}
                                </td>
                                <td class="px-6 py-4 text-gray-900">
                                    {order.vendor?.name || "-"}
                                </td>
                                <td class="px-6 py-4 text-gray-600">
                                    {order.branch?.name || "-"}
                                </td>
                                <td class="px-6 py-4 font-medium text-gray-900">
                                    JD {formatCurrency(order.total)}
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        class={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.status)}`}
                                    >
                                        <StatusIcon class="w-3.5 h-3.5" />
                                        {order.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right rtl:text-left">
                                    <button
                                        onclick={() => viewDetails(order)}
                                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                                        title="View Details"
                                    >
                                        <Eye class="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Details Modal -->
{#if showDetailsModal && selectedOrder}
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
                        <ShoppingBag class="w-5 h-5 text-blue-600" />
                        Purchase Order Details
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">
                        {selectedOrder.orderNumber}
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
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div
                        class="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        <p class="text-sm text-gray-500 mb-1">Vendor</p>
                        <p class="font-medium text-gray-900">
                            {selectedOrder.vendor?.name || "-"}
                        </p>
                    </div>
                    <div
                        class="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        <p class="text-sm text-gray-500 mb-1">Branch</p>
                        <p class="font-medium text-gray-900">
                            {selectedOrder.branch?.name || "-"}
                        </p>
                    </div>
                    <div
                        class="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        <p class="text-sm text-gray-500 mb-1">Date</p>
                        <p class="font-medium text-gray-900">
                            {formatDate(selectedOrder.createdAt)}
                        </p>
                    </div>
                    <div
                        class="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                        <p class="text-sm text-gray-500 mb-1">Status</p>
                        <span
                            class={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedOrder.status)}`}
                        >
                            {selectedOrder.status}
                        </span>
                    </div>
                </div>

                <div class="border rounded-lg overflow-hidden">
                    <table class="w-full text-sm text-left">
                        <thead
                            class="bg-gray-50 text-gray-600 font-medium border-b"
                        >
                            <tr>
                                <th class="px-4 py-3">Item</th>
                                <th class="px-4 py-3 text-right">Qty</th>
                                <th class="px-4 py-3 text-right">Unit Price</th>
                                <th class="px-4 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each selectedOrder.lines as line}
                                <tr>
                                    <td class="px-4 py-3 font-medium"
                                        >{line.item?.name || "Unknown Item"}</td
                                    >
                                    <td class="px-4 py-3 text-right"
                                        >{line.quantity}</td
                                    >
                                    <td class="px-4 py-3 text-right"
                                        >JD {formatCurrency(line.unitPrice)}</td
                                    >
                                    <td class="px-4 py-3 font-medium text-right"
                                        >JD {formatCurrency(line.total)}</td
                                    >
                                </tr>
                            {:else}
                                <tr>
                                    <td
                                        colspan="4"
                                        class="px-4 py-8 text-center text-gray-500"
                                    >
                                        No line items found for this order.
                                    </td>
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
                                <span>Subtotal</span>
                                <span
                                    >JD {formatCurrency(
                                        selectedOrder.subtotal,
                                    )}</span
                                >
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span
                                    >JD {formatCurrency(
                                        selectedOrder.tax,
                                    )}</span
                                >
                            </div>
                            <div class="flex justify-between text-gray-600">
                                <span>Discount</span>
                                <span
                                    >- JD {formatCurrency(
                                        selectedOrder.discount,
                                    )}</span
                                >
                            </div>
                            <div
                                class="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-base"
                            >
                                <span>Total</span>
                                <span
                                    >JD {formatCurrency(
                                        selectedOrder.total,
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
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}
