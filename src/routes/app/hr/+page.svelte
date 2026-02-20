<script lang="ts">
    import {
        Users,
        Banknote,
        CalendarClock,
        Briefcase,
        DollarSign,
    } from "lucide-svelte";
    import { _ } from "svelte-i18n";
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">
            {$_("modules.hr.title")}
        </h1>
        <p class="text-gray-500">
            {$_("modules.hr.subtitle")}
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
            href="/app/hr/employees"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors"
            >
                <Users class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.hr.employees")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.hr.manageStaff")}
            </p>
        </a>

        <a
            href="/app/hr/payroll"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-green-50 rounded-lg w-fit group-hover:bg-green-100 transition-colors"
            >
                <Banknote class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.hr.payroll")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.hr.processSalaries")}
            </p>
        </a>

        <a
            href="/app/hr/leaves"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-purple-50 rounded-lg w-fit group-hover:bg-purple-100 transition-colors"
            >
                <CalendarClock class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.hr.leaves")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.hr.approveTimeOff")}
            </p>
        </a>

        <a
            href="/app/hr/deductions"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group"
        >
            <div
                class="p-3 bg-red-50 rounded-lg w-fit group-hover:bg-red-100 transition-colors"
            >
                <DollarSign class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="font-bold text-gray-900 mt-4">
                {$_("modules.hr.deductions")}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
                {$_("modules.hr.configureTaxes")}
            </p>
        </a>
    </div>
</div>
