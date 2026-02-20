<script lang="ts">
    import { Calculator, FileText, ClipboardList } from "lucide-svelte";
    import { _ } from "svelte-i18n";
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">
            {$_("modules.accounting.title")}
        </h1>
        <p class="text-gray-500">{$_("modules.accounting.subtitle")}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
            href="/app/accounting/accounts"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors"
            >
                <ClipboardList class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.accounting.chartOfAccounts")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.accounting.manageGL")}
            </p>
        </a>

        <a
            href="/app/accounting/journals"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-green-50 rounded-lg w-fit group-hover:bg-green-100 transition-colors"
            >
                <Calculator class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.accounting.journalEntries")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.accounting.recordTransactions")}
            </p>
        </a>

        <a
            href="/app/accounting/reports"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-purple-50 rounded-lg w-fit group-hover:bg-purple-100 transition-colors"
            >
                <FileText class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.accounting.reports")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.accounting.viewReports")}
            </p>
        </a>
    </div>
</div>
