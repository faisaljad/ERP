<script lang="ts">
    import { _ } from "svelte-i18n";
    import { enhance } from "$app/forms";
    import {
        Search,
        User,
        Trash2,
        Plus,
        Minus,
        CreditCard,
        Banknote,
        ArrowLeft,
        ShoppingCart,
        ChevronDown,
    } from "lucide-svelte";
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";

    let { data } = $props<{ data: PageData }>();

    // Core state
    let cart = $state<any[]>([]);
    let selectedCategory = $state<string>("ALL");
    let searchQuery = $state("");
    let selectedCustomer = $state<string>("");

    // Checkout state
    let isProcessing = $state(false);
    let checkoutModalOpen = $state(false);
    let paymentMethod = $state<"CASH" | "CARD" | "TRANSFER">("CASH");
    let amountPaid = $state<number>(0);

    // Derived state
    let filteredItems = $derived(
        data.items.filter((item: any) => {
            const matchesCategory =
                selectedCategory === "ALL" ||
                item.categoryId === selectedCategory;
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.sku &&
                    item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        }),
    );

    let cartSubtotal = $derived(
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );
    let cartTax = $derived(cartSubtotal * 0.15); // Hardcoded 15% tax for now, should come from item/settings
    let cartTotal = $derived(cartSubtotal + cartTax);

    // Actions
    function addToCart(item: any) {
        const existing = cart.find((c) => c.itemId === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                itemId: item.id,
                name: item.name,
                price: Number(item.costPrice || 10) * 1.5, // Mock selling price as 1.5x cost
                quantity: 1,
            });
        }
    }

    function updateQuantity(index: number, delta: number) {
        if (cart[index].quantity + delta > 0) {
            cart[index].quantity += delta;
        } else {
            removeFromCart(index);
        }
    }

    function removeFromCart(index: number) {
        cart.splice(index, 1);
    }

    function clearCart() {
        cart = [];
    }

    // Helper functions
    const formatCurrency = (amount: number) => amount.toFixed(2);

    // Handlers
    function handleCheckoutClick() {
        if (cart.length === 0) return;
        amountPaid = cartTotal;
        checkoutModalOpen = true;
    }
</script>

<!-- Hide the main layout sidebar and header for POS view -->
<svelte:head>
    <title>{$_("modules.sales.pos")} - {data.session.register.name}</title>
</svelte:head>

<div class="fixed inset-0 bg-gray-100 flex flex-col z-[100]">
    <!-- POS Header -->
    <header
        class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0 shadow-sm"
    >
        <div class="flex items-center gap-4">
            <button
                onclick={() => goto("/app/pos/sessions")}
                class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Sessions"
            >
                <ArrowLeft class="w-5 h-5 rtl:rotate-180" />
            </button>
            <div>
                <h1 class="font-bold text-gray-900 text-lg leading-tight">
                    {$_("modules.sales.pos")}
                </h1>
                <p
                    class="text-xs text-gray-500 font-medium flex items-center gap-1"
                >
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    {data.session.register.name} ({data.session.register.branch
                        .name})
                </p>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <div
                class="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
            >
                <User class="w-4 h-4 text-gray-400" />
                <span class="font-medium text-gray-700"
                    >{data.session.user.name}</span
                >
            </div>
            <div class="relative">
                <div
                    class="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 flex items-center pointer-events-none"
                >
                    <Search class="w-4 h-4 text-gray-400" />
                </div>
                <!-- Need proper localization keys for POS placeholers, using generic search for now -->
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search products..."
                    class="pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-48 focus:w-64 transition-all"
                />
            </div>
        </div>
    </header>

    <!-- Main Layout -->
    <div class="flex-1 flex overflow-hidden">
        <!-- Left Pane: Product Grid -->
        <div class="flex-1 flex flex-col bg-gray-50">
            <!-- Categories Browser -->
            <div
                class="bg-white border-b border-gray-200 p-3 overflow-x-auto flex gap-2 shrink-0 hide-scrollbar"
            >
                <button
                    onclick={() => (selectedCategory = "ALL")}
                    class={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${selectedCategory === "ALL" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                    All Categories
                </button>
                {#each data.categories as category}
                    <button
                        onclick={() => (selectedCategory = category.id)}
                        class={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${selectedCategory === category.id ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        {category.name}
                    </button>
                {/each}
            </div>

            <!-- Products Grid -->
            <div class="flex-1 overflow-y-auto p-4 content-area">
                {#if filteredItems.length === 0}
                    <div
                        class="flex flex-col items-center justify-center h-full text-gray-400"
                    >
                        <Search class="w-12 h-12 mb-4 opacity-20" />
                        <p class="text-lg font-medium">No products found</p>
                    </div>
                {:else}
                    <div
                        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20"
                    >
                        {#each filteredItems as item}
                            <button
                                onclick={() => addToCart(item)}
                                class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col items-start text-left group active:scale-95"
                            >
                                <div
                                    class="w-full aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                                >
                                    <!-- Mock image placeholder -->
                                    <ShoppingCart
                                        class="w-8 h-8 text-gray-300 group-hover:text-blue-200 transition-colors"
                                    />
                                    <!-- Price Tag overlay -->
                                    <div
                                        class="absolute bottom-2 right-2 rtl:left-2 rtl:right-auto bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-xs font-bold text-gray-900"
                                    >
                                        JD {formatCurrency(
                                            Number(item.costPrice || 10) * 1.5,
                                        )}
                                    </div>
                                </div>
                                <h3
                                    class="font-bold text-gray-900 text-sm line-clamp-2 leading-snug"
                                >
                                    {item.name}
                                </h3>
                                {#if item.sku}
                                    <p class="text-xs text-gray-500 mt-1">
                                        {item.sku}
                                    </p>
                                {/if}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Right Pane: Cart & Checkout (Fixed Width) -->
        <div
            class="w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 shadow-xl sm:shadow-none"
        >
            <!-- Customer Selector -->
            <div class="p-4 border-b border-gray-100 bg-gray-50">
                <div class="relative">
                    <User
                        class="w-5 h-5 text-gray-400 absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2"
                    />
                    <select
                        bind:value={selectedCustomer}
                        class="w-full pl-10 rtl:pr-10 rtl:pl-3 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700"
                    >
                        <option value="">Walk-in Customer</option>
                        {#each data.customers as customer}
                            <option value={customer.id}>{customer.name}</option>
                        {/each}
                    </select>
                    <ChevronDown
                        class="w-4 h-4 text-gray-400 absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                </div>
            </div>

            <!-- Cart Items -->
            <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                {#if cart.length === 0}
                    <div
                        class="flex flex-col items-center justify-center h-full text-gray-400 space-y-4"
                    >
                        <ShoppingCart class="w-16 h-16 opacity-20" />
                        <p class="font-medium">Cart is empty</p>
                    </div>
                {:else}
                    {#each cart as item, index}
                        <div
                            class="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg group"
                        >
                            <!-- Item Info -->
                            <div class="flex-1 min-w-0 pr-2">
                                <h4
                                    class="font-bold text-gray-900 text-sm truncate"
                                >
                                    {item.name}
                                </h4>
                                <div class="text-xs text-gray-500 mt-0.5">
                                    JD {formatCurrency(item.price)}
                                </div>
                            </div>

                            <!-- Controls -->
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex items-center bg-white border border-gray-200 rounded-md shadow-sm"
                                >
                                    <button
                                        onclick={() =>
                                            updateQuantity(index, -1)}
                                        class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-l-md transition-colors"
                                    >
                                        <Minus class="w-3.5 h-3.5" />
                                    </button>
                                    <span
                                        class="w-8 text-center font-bold text-sm text-gray-900"
                                        >{item.quantity}</span
                                    >
                                    <button
                                        onclick={() => updateQuantity(index, 1)}
                                        class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-r-md transition-colors"
                                    >
                                        <Plus class="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div
                                    class="font-bold text-gray-900 text-sm w-16 text-right"
                                >
                                    {formatCurrency(item.price * item.quantity)}
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Totals & Actions -->
            <div class="p-4 bg-gray-50 border-t border-gray-200">
                <div class="space-y-2 mb-4">
                    <div class="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span class="font-medium"
                            >JD {formatCurrency(cartSubtotal)}</span
                        >
                    </div>
                    <div class="flex justify-between text-sm text-gray-600">
                        <span>Tax (15%)</span>
                        <span class="font-medium"
                            >JD {formatCurrency(cartTax)}</span
                        >
                    </div>
                    <div
                        class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200 border-dashed"
                    >
                        <span>Total</span>
                        <span>JD {formatCurrency(cartTotal)}</span>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-2">
                    <button
                        onclick={clearCart}
                        disabled={cart.length === 0}
                        class="col-span-1 py-3 flex items-center justify-center bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50"
                        title="Clear Cart"
                    >
                        <Trash2 class="w-5 h-5" />
                    </button>
                    <button
                        onclick={handleCheckoutClick}
                        disabled={cart.length === 0}
                        class="col-span-3 py-3 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                    >
                        Checkout
                        <ArrowLeft class="w-5 h-5 rtl:rotate-180 rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Checkout Modal Overlay -->
{#if checkoutModalOpen}
    <div
        class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
    >
        <div
            class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            <div
                class="p-6 bg-blue-600 text-white flex justify-between items-center shrink-0"
            >
                <h2 class="text-2xl font-bold">Payment</h2>
                <div class="text-xl font-bold bg-white/20 px-3 py-1 rounded-lg">
                    JD {formatCurrency(cartTotal)}
                </div>
            </div>

            <div class="p-6 flex-1 overflow-y-auto">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onclick={() => (paymentMethod = "CASH")}
                        class={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "CASH" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-blue-200"}`}
                    >
                        <Banknote class="w-8 h-8" />
                        <span class="font-bold">Cash</span>
                    </button>
                    <button
                        onclick={() => (paymentMethod = "CARD")}
                        class={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "CARD" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-blue-200"}`}
                    >
                        <CreditCard class="w-8 h-8" />
                        <span class="font-bold">Card</span>
                    </button>
                </div>

                {#if paymentMethod === "CASH"}
                    <div
                        class="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6"
                    >
                        <label
                            for="amountPaid"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Amount Received</label
                        >
                        <div class="relative">
                            <span
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold"
                                >JD</span
                            >
                            <input
                                type="number"
                                id="amountPaid"
                                bind:value={amountPaid}
                                step="0.01"
                                class="w-full text-right pl-12 pr-4 py-3 text-xl font-bold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div
                            class="mt-4 flex justify-between items-center text-lg"
                        >
                            <span class="text-gray-600 font-medium"
                                >Change Due:</span
                            >
                            <span
                                class={`font-bold ${amountPaid >= cartTotal ? "text-green-600" : "text-red-500"}`}
                            >
                                JD {formatCurrency(
                                    Math.max(0, amountPaid - cartTotal),
                                )}
                            </span>
                        </div>
                    </div>
                {/if}
            </div>

            <div
                class="p-6 bg-gray-50 border-t border-gray-200 flex gap-4 shrink-0"
            >
                <button
                    onclick={() => (checkoutModalOpen = false)}
                    class="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <!-- Use Svelte's enhance form action to handle submission smoothly -->
                <form
                    method="POST"
                    action="?/checkout"
                    class="flex-1"
                    use:enhance={({ formData }) => {
                        isProcessing = true;

                        // Construct the full payload
                        const payload = {
                            sessionId: data.session.id,
                            customerId: selectedCustomer || null,
                            items: cart,
                            subtotal: cartSubtotal,
                            tax: cartTax,
                            discount: 0,
                            total: cartTotal,
                            paymentMethod,
                            amountPaid,
                        };

                        formData.append("payload", JSON.stringify(payload));

                        return async ({ result, update }) => {
                            isProcessing = false;
                            if (result.type === "success") {
                                // Reset cart on success
                                clearCart();
                                selectedCustomer = "";
                                checkoutModalOpen = false;
                            }
                            await update();
                        };
                    }}
                >
                    <button
                        type="submit"
                        disabled={isProcessing ||
                            (paymentMethod === "CASH" &&
                                amountPaid < cartTotal)}
                        class="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {#if isProcessing}
                            Processing...
                        {:else}
                            Confirm Payment
                        {/if}
                    </button>
                </form>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Hide scrollbar for category browser but keep functionality */
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    /* Ensure content area scrolls independently */
    .content-area {
        height: 0; /* Let flex box calculate the correct height */
    }
</style>
