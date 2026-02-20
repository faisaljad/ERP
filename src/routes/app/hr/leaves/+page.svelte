<script lang="ts">
    import { enhance } from "$app/forms";
    import { Calendar, CheckCircle, XCircle, Clock, Plus } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data, form } = $props();
    let showRequestModal = $state(false);

    function getStatusColor(status: string) {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case "APPROVED":
                return CheckCircle;
            case "REJECTED":
                return XCircle;
            default:
                return Clock;
        }
    }
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.hr.leavesPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.hr.leavesPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => (showRequestModal = true)}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.hr.leavesPage.newRequest")}
        </button>
    </div>

    {#if showRequestModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {$_("modules.hr.leavesPage.requestLeave")}
                </h2>
                <form method="POST" action="?/create" use:enhance>
                    <div class="space-y-4">
                        <div>
                            <label
                                for="employeeId"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.leavesPage.employee")}</label
                            >
                            <select
                                name="employeeId"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            >
                                <option value="" disabled selected
                                    >{$_(
                                        "modules.hr.leavesPage.selectEmployee",
                                    )}</option
                                >
                                {#each data.employees as employee}
                                    <option value={employee.id}
                                        >{employee.firstName}
                                        {employee.lastName}</option
                                    >
                                {/each}
                            </select>
                        </div>

                        <div>
                            <label
                                for="type"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.leavesPage.leaveType")}</label
                            >
                            <select
                                name="type"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            >
                                <option value="ANNUAL"
                                    >{$_(
                                        "modules.hr.leavesPage.types.ANNUAL",
                                    )}</option
                                >
                                <option value="SICK"
                                    >{$_(
                                        "modules.hr.leavesPage.types.SICK",
                                    )}</option
                                >
                                <option value="UNPAID"
                                    >{$_(
                                        "modules.hr.leavesPage.types.UNPAID",
                                    )}</option
                                >
                                <option value="OTHER"
                                    >{$_(
                                        "modules.hr.leavesPage.types.OTHER",
                                    )}</option
                                >
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    for="startDate"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.hr.leavesPage.startDate",
                                    )}</label
                                >
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                            <div>
                                <label
                                    for="endDate"
                                    class="block text-sm font-medium text-gray-700"
                                    >{$_(
                                        "modules.hr.leavesPage.endDate",
                                    )}</label
                                >
                                <input
                                    type="date"
                                    name="endDate"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                for="reason"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.hr.leavesPage.reason")}</label
                            >
                            <textarea
                                name="reason"
                                rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            ></textarea>
                        </div>
                    </div>

                    {#if form?.error}
                        <p class="text-red-500 text-sm mt-2">{form.error}</p>
                    {/if}

                    <div class="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onclick={() => (showRequestModal = false)}
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >{$_("modules.hr.leavesPage.cancel")}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_("modules.hr.leavesPage.submit")}</button
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
                        >{$_("modules.hr.leavesPage.employee")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.leavesPage.type")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.leavesPage.duration")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.leavesPage.reason")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.leavesPage.status")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.hr.leavesPage.actions")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.leaveRequests as request}
                    {@const StatusIcon = getStatusIcon(request.status)}
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="font-medium text-gray-900">
                                {request.employee.firstName}
                                {request.employee.lastName}
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            <span
                                class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
                                >{$_(
                                    `modules.hr.leavesPage.types.${request.type}`,
                                )}</span
                            >
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                            <div class="flex items-center gap-2">
                                <Calendar class="w-3 h-3" />
                                <span
                                    >{new Date(
                                        request.startDate,
                                    ).toLocaleDateString()} - {new Date(
                                        request.endDate,
                                    ).toLocaleDateString()}</span
                                >
                            </div>
                        </td>
                        <td
                            class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate"
                        >
                            {request.reason || "-"}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span
                                class={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                            >
                                <StatusIcon class="w-3 h-3" />
                                {request.status}
                            </span>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium"
                        >
                            {#if request.status === "PENDING"}
                                <div class="flex justify-end gap-2">
                                    <form
                                        action="?/approve"
                                        method="POST"
                                        use:enhance
                                        class="inline"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={request.id}
                                        />
                                        <button
                                            type="submit"
                                            class="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded hover:bg-green-100"
                                            >{$_(
                                                "modules.hr.leavesPage.approve",
                                            )}</button
                                        >
                                    </form>
                                    <form
                                        action="?/reject"
                                        method="POST"
                                        use:enhance
                                        class="inline"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={request.id}
                                        />
                                        <button
                                            type="submit"
                                            class="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded hover:bg-red-100"
                                            >{$_(
                                                "modules.hr.leavesPage.reject",
                                            )}</button
                                        >
                                    </form>
                                </div>
                            {:else}
                                <span class="text-gray-400">-</span>
                            {/if}
                        </td>
                    </tr>
                {/each}
                {#if data.leaveRequests.length === 0}
                    <tr>
                        <td
                            colspan="6"
                            class="px-6 py-12 text-center text-gray-500"
                        >
                            {$_("modules.hr.leavesPage.noRequests")}
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
