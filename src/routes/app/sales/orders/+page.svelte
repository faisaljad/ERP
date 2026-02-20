<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        Search,
        FileText,
        Plus,
        Eye,
        CheckCircle,
        XCircle,
        Clock,
    } from "lucide-svelte";
    import type { PageData } from "./$types";
    import type { Prisma } from "@prisma/client";

    let { data } = $props<{ data: PageData }>();

    // Define explicitly to satisfy svelte-check inference issues with nested includes
    type OrderWithRelations = Prisma.OrderGetPayload<{
        include: { customer: true; branch: true };
    }>;

    let orders = $derived(data.orders as OrderWithRelations[]);

    let searchQuery = $state("");

    let filteredOrders = $derived(
        orders.filter(
            (order) =>
                order.orderNumber
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (order.customer?.name &&
                    order.customer.name
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
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return CheckCircle;
            case "CANCELLED":
                return XCircle;
            case "PENDING":
                return Clock;
            default:
                return FileText;
        }
    };
</script>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <!-- Hardcoded English labels for now as they are not explicitly in i18n yet -->
            <h1 class="text-2xl font-bold text-gray-900">Sales Orders</h1>
            <p class="text-gray-500">Manage B2B sales and view past orders.</p>
        </div>
        <button
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            New Order
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
                placeholder="Search by order number or customer..."
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
                        <th class="px-6 py-4 font-medium">Order Number</th>
                        <th class="px-6 py-4 font-medium">Date</th>
                        <th class="px-6 py-4 font-medium">Customer</th>
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
                                    <FileText
                                        class="w-12 h-12 text-gray-300 mb-3"
                                    />
                                    <p
                                        class="text-base font-medium text-gray-900"
                                    >
                                        No sales orders found
                                    </p>
                                    <p class="mt-1">
                                        Try adjusting your search or create a
                                        new order.
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
                                    {order.customer?.name || "-"}
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
