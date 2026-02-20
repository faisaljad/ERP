<script lang="ts">
    import { enhance } from "$app/forms";
    import { ArrowLeft, Plus, Save, Trash2 } from "lucide-svelte";
    import type { PageData, ActionData } from "./$types";

    let { data, form } = $props<{ data: PageData; form: ActionData }>();

    let lines = $state([{ itemId: "", quantity: 1, unitPrice: 0 }]);

    function addLine() {
        lines.push({ itemId: "", quantity: 1, unitPrice: 0 });
    }

    function removeLine(index: number) {
        if (lines.length > 1) {
            lines.splice(index, 1);
        }
    }

    let subtotal = $derived(
        lines.reduce((acc, line) => acc + line.quantity * line.unitPrice, 0),
    );
</script>

<div class="max-w-4xl mx-auto py-8">
    <div class="mb-6 flex items-center gap-4">
        <a
            href="/app/purchasing/orders"
            class="p-2 hover:bg-gray-100 rounded-full text-gray-500"
        >
            <ArrowLeft class="w-5 h-5 rtl:rotate-180" />
        </a>
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                Create Purchase Order
            </h1>
            <p class="text-gray-500 text-sm mt-1">
                Issue a new order to your supplier.
            </p>
        </div>
    </div>

    <form
        method="POST"
        use:enhance
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
        <div class="p-6 space-y-6">
            {#if form?.error}
                <div
                    class="p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg"
                >
                    {form.error}
                </div>
            {/if}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        for="vendorId"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Vendor</label
                    >
                    <select
                        name="vendorId"
                        required
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white"
                    >
                        <option value="" disabled selected
                            >Select a vendor...</option
                        >
                        {#each data.vendors as vendor}
                            <option value={vendor.id}>{vendor.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label
                        for="branchId"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Receiving Branch</label
                    >
                    <select
                        name="branchId"
                        required
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white"
                    >
                        <option value="" disabled selected
                            >Select a branch...</option
                        >
                        {#each data.branches as branch}
                            <option value={branch.id}>{branch.name}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="pt-6 border-t border-gray-100">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-gray-900">Order Lines</h2>
                    <button
                        type="button"
                        onclick={addLine}
                        class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus class="w-4 h-4" /> Add Item
                    </button>
                </div>

                <!-- We serialize this lines array into a hidden input because forms natively can't handle deep arrays of objects well easily in Svelte without named indexing -->
                <input
                    type="hidden"
                    name="lines"
                    value={JSON.stringify(lines)}
                />

                <div class="space-y-3">
                    {#each lines as line, i}
                        <div
                            class="flex flex-col sm:flex-row gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg relative"
                        >
                            <div class="flex-1">
                                <label class="sr-only">Item</label>
                                <select
                                    bind:value={line.itemId}
                                    required
                                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-sm"
                                >
                                    <option value="" disabled selected
                                        >Select item...</option
                                    >
                                    {#each data.items as item}
                                        <option value={item.id}
                                            >{item.name} ({item.sku})</option
                                        >
                                    {/each}
                                </select>
                            </div>

                            <div class="w-full sm:w-32">
                                <label class="sr-only">Quantity</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs text-center border-r pr-2 my-2 cursor-pointer pointer-events-none"
                                        >Qty</span
                                    >
                                    <input
                                        type="number"
                                        bind:value={line.quantity}
                                        min="1"
                                        required
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 pl-12 text-sm text-right bg-white"
                                    />
                                </div>
                            </div>

                            <div class="w-full sm:w-40">
                                <label class="sr-only">Unit Price</label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs text-center border-r pr-2 my-2 cursor-pointer pointer-events-none"
                                        >JD</span
                                    >
                                    <input
                                        type="number"
                                        bind:value={line.unitPrice}
                                        min="0"
                                        step="0.01"
                                        required
                                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 pl-12 text-sm text-right bg-white"
                                    />
                                </div>
                            </div>

                            <!-- svelte-ignore a11y_consider_explicit_label -->
                            <button
                                type="button"
                                onclick={() => removeLine(i)}
                                class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors self-end sm:self-center"
                                disabled={lines.length === 1}
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    {/each}
                </div>

                <div class="mt-6 flex justify-end">
                    <div
                        class="w-64 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
                    >
                        <div
                            class="flex justify-between items-center font-bold text-gray-900"
                        >
                            <span>Total</span>
                            <span class="text-xl">JD {subtotal.toFixed(2)}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-xl"
        >
            <a
                href="/app/purchasing/orders"
                class="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
                Cancel
            </a>
            <button
                type="submit"
                class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Save class="w-4 h-4" />
                Draft Order
            </button>
        </div>
    </form>
</div>
