<script lang="ts">
    import { enhance } from "$app/forms";
    import { Banknote, Play, Plus, History } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data } = $props();
    let showRunPayrollModal = $state(false);
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.hr.payrollPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.hr.payrollPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => (showRunPayrollModal = true)}
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
            <Play class="w-4 h-4" />
            {$_("modules.hr.payrollPage.runPayroll")}
        </button>
    </div>

    {#if showRunPayrollModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {$_("modules.hr.payrollPage.runPayroll")}
                </h2>
                <form method="POST" action="?/run" use:enhance>
                    <div class="space-y-4">
                        <div>
                            <label
                                for="month"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.payrollPage.month")}</label
                            >
                            <input
                                type="month"
                                name="month"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <p class="text-sm text-gray-500">
                            {$_("modules.hr.payrollPage.runDescription")}
                        </p>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onclick={() => (showRunPayrollModal = false)}
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >{$_("modules.hr.payrollPage.cancel")}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >{$_("modules.hr.payrollPage.proceed")}</button
                        >
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <div
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.payrollPage.employee")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.payrollPage.period")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.payrollPage.baseSalaryProrated")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.payrollPage.allowances")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.payrollPage.deductions")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.payrollPage.netSalary")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.payrollPage.status")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.payrolls as payroll}
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="font-medium text-gray-900">
                                {payroll.employee.firstName}
                                {payroll.employee.lastName}
                            </div>
                            <div class="text-xs text-gray-500">
                                {payroll.employee.position}
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {new Date(payroll.periodStart).toLocaleDateString()}
                            - {new Date(payroll.periodEnd).toLocaleDateString()}
                        </td>

                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium text-gray-900"
                        >
                            {Number(payroll.baseSalary).toFixed(2)}
                            <span
                                class="block text-xs text-gray-400 font-normal"
                            >
                                {Number(payroll.originalSalary).toFixed(2)} ({payroll.payableDays}
                                {$_("modules.hr.payrollPage.days")})
                            </span>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm text-green-600"
                        >
                            +{Number(payroll.allowances).toFixed(2)}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm text-red-600"
                        >
                            -{Number(payroll.deductions).toFixed(2)}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm font-bold text-gray-900"
                        >
                            {Number(payroll.netSalary).toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            {#if payroll.isPaid}
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                    {$_("modules.hr.payrollPage.paid")}
                                </span>
                            {:else}
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                >
                                    {$_("modules.hr.payrollPage.pending")}
                                </span>
                            {/if}
                        </td>
                    </tr>
                {/each}
                {#if data.payrolls.length === 0}
                    <tr>
                        <td
                            colspan="7"
                            class="px-6 py-12 text-center text-gray-500"
                        >
                            {$_("modules.hr.payrollPage.noRecords")}
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
