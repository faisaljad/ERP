<script lang="ts">
    import { FileText, PieChart, TrendingUp } from "lucide-svelte";
    import { _ } from "svelte-i18n";
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">
            {$_("modules.accounting.financialReports.title")}
        </h1>
        <p class="text-gray-500">
            {$_("modules.accounting.financialReports.subtitle")}
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Report Cards (Placeholders for now) -->
        <div
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:border-blue-500 transition-colors cursor-pointer"
        >
            <div class="flex items-center gap-4 mb-4">
                <div
                    class="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors"
                >
                    <FileText class="w-6 h-6 text-blue-600" />
                </div>
                <h3 class="font-bold text-gray-900">
                    {$_("modules.accounting.financialReports.balanceSheet")}
                </h3>
            </div>
            <p class="text-sm text-gray-500">
                {$_("modules.accounting.financialReports.balanceSheetDesc")}
            </p>
            <button
                class="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                >{$_("modules.accounting.financialReports.viewReport")} &rarr;</button
            >
        </div>

        <div
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:border-green-500 transition-colors cursor-pointer"
        >
            <div class="flex items-center gap-4 mb-4">
                <div
                    class="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors"
                >
                    <TrendingUp class="w-6 h-6 text-green-600" />
                </div>
                <h3 class="font-bold text-gray-900">
                    {$_("modules.accounting.financialReports.incomeStatement")}
                </h3>
            </div>
            <p class="text-sm text-gray-500">
                {$_("modules.accounting.financialReports.incomeStatementDesc")}
            </p>
            <button
                class="mt-4 text-sm font-medium text-green-600 hover:text-green-800"
                >{$_("modules.accounting.financialReports.viewReport")} &rarr;</button
            >
        </div>

        <div
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:border-purple-500 transition-colors cursor-pointer"
        >
            <div class="flex items-center gap-4 mb-4">
                <div
                    class="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors"
                >
                    <PieChart class="w-6 h-6 text-purple-600" />
                </div>
                <h3 class="font-bold text-gray-900">
                    {$_("modules.accounting.financialReports.trialBalance")}
                </h3>
            </div>
            <p class="text-sm text-gray-500">
                {$_("modules.accounting.financialReports.trialBalanceDesc")}
            </p>
            <button
                class="mt-4 text-sm font-medium text-purple-600 hover:text-purple-800"
                >{$_("modules.accounting.financialReports.viewReport")} &rarr;</button
            >
        </div>
    </div>

    <div
        class="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200"
    >
        <p class="font-medium">
            🚧 {$_("modules.accounting.financialReports.underConstruction")}
        </p>
        <p class="text-sm mt-1">
            {$_("modules.accounting.financialReports.constructionDesc")}
        </p>
    </div>
</div>
