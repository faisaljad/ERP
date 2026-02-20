<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Building2, ShoppingBag, FileText, Package } from "lucide-svelte";
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <!-- Hardcoded for now, will map to translations -->
            <h1
                class="text-2xl font-bold text-gray-900 flex items-center gap-2"
            >
                <Package class="w-6 h-6 text-blue-600" />
                Purchasing
            </h1>
            <p class="text-gray-500 mt-1">
                Manage vendors, purchase orders, and incoming procurement.
            </p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Vendor Management -->
        <a
            href="/app/purchasing/vendors"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <Building2 class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Vendors</h2>
            <p class="text-gray-500 text-sm">
                Manage suppliers, contacts, and vendor details.
            </p>
        </a>

        <!-- Purchase Orders -->
        <a
            href="/app/purchasing/orders"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <ShoppingBag class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                Purchase Orders
            </h2>
            <p class="text-gray-500 text-sm">
                Create and track orders from your vendors.
            </p>
        </a>

        <!-- Vendor Bills -->
        <a
            href="/app/purchasing/bills"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <FileText class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.purchasing.bills")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.purchasing.billsPage.subtitle")}
            </p>
        </a>
    </div>
</div>
