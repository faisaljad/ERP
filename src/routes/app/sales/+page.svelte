<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Users, MonitorPlay, FileText } from "lucide-svelte";
</script>

<div class="space-y-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.sales.title")}
            </h1>
            <p class="text-gray-500 mt-1">
                {$_("modules.sales.subtitle")}
            </p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Customer Management -->
        <a
            href="/app/sales/customers"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <Users class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.sales.customers")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.sales.customersPage.subtitle")}
            </p>
        </a>

        <!-- POS Sessions -->
        <a
            href="/app/pos/sessions"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <MonitorPlay class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.sales.sessionsPage.title")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.sales.sessionsPage.subtitle")}
            </p>
        </a>

        <!-- Sales Orders & Invoices (Placeholder) -->
        <a
            href="/app/sales/orders"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <FileText class="w-6 h-6" />
            </div>
            <!-- Missing explicit translation, using placeholder string -->
            <h2 class="text-xl font-bold text-gray-900 mb-2">Sales Orders</h2>
            <p class="text-gray-500 text-sm">
                Manage B2B sales and view past orders.
            </p>
        </a>
    </div>
</div>
