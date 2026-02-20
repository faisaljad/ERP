<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, User, Mail, Briefcase, Calendar } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data, form } = $props();
    let showCreateModal = $state(false);
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.hr.employeesPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.hr.employeesPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => (showCreateModal = true)}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.hr.employeesPage.addEmployee")}
        </button>
    </div>

    {#if showCreateModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div
                class="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
            >
                <h2 class="text-xl font-bold mb-4">
                    {$_("modules.hr.employeesPage.newEmployee")}
                </h2>
                <form method="POST" action="?/create" use:enhance>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="firstName"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.hr.employeesPage.firstName",
                                    )}</label
                                >
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                            <div>
                                <label
                                    for="lastName"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.hr.employeesPage.lastName",
                                    )}</label
                                >
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                for="email"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.employeesPage.email")}</label
                            >
                            <input
                                type="email"
                                name="email"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="position"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.hr.employeesPage.position",
                                    )}</label
                                >
                                <input
                                    type="text"
                                    name="position"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                            <div>
                                <label
                                    for="hireDate"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.hr.employeesPage.hireDate",
                                    )}</label
                                >
                                <input
                                    type="date"
                                    name="hireDate"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                for="baseSalary"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.hr.employeesPage.baseSalary",
                                )}</label
                            >
                            <input
                                type="number"
                                name="baseSalary"
                                step="0.01"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>

                        <div>
                            <label
                                for="branchId"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.employeesPage.branch")}</label
                            >
                            <select
                                name="branchId"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            >
                                <option value=""
                                    >{$_(
                                        "modules.hr.employeesPage.selectBranch",
                                    )}</option
                                >
                                {#each data.branches as branch}
                                    <option value={branch.id}
                                        >{branch.name}</option
                                    >
                                {/each}
                            </select>
                        </div>
                    </div>

                    {#if form?.error}
                        <p class="text-red-500 text-sm mt-2">{form.error}</p>
                    {/if}

                    <div class="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onclick={() => (showCreateModal = false)}
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >{$_("modules.hr.employeesPage.cancel")}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_("modules.hr.employeesPage.save")}</button
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
                        >{$_("modules.hr.employeesPage.firstName")} & {$_(
                            "modules.hr.employeesPage.lastName",
                        )}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.employeesPage.position")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.employeesPage.contact")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.employeesPage.joined")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.employeesPage.salary")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.employees as employee}
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div
                                    class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0"
                                >
                                    {employee.firstName[0]}{employee
                                        .lastName[0]}
                                </div>
                                <div class="ms-4">
                                    <div
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        {employee.firstName}
                                        {employee.lastName}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {employee.branch?.name ||
                                            $_(
                                                "modules.hr.employeesPage.noBranch",
                                            )}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            <div class="flex items-center gap-2">
                                <Briefcase class="w-3 h-3" />
                                {employee.position}
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            {#if employee.email}
                                <div class="flex items-center gap-2">
                                    <Mail class="w-3 h-3" />
                                    {employee.email}
                                </div>
                            {:else}
                                -
                            {/if}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            <div class="flex items-center gap-2">
                                <Calendar class="w-3 h-3" />
                                {new Date(
                                    employee.hireDate,
                                ).toLocaleDateString()}
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium text-gray-900 font-mono"
                        >
                            {Number(employee.baseSalary).toFixed(2)}
                        </td>
                    </tr>
                {/each}
                {#if data.employees.length === 0}
                    <tr>
                        <td
                            colspan="5"
                            class="px-6 py-12 text-center text-gray-500"
                        >
                            {$_("modules.hr.employeesPage.noEmployees")}
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
