<script lang="ts">
    import { enhance } from "$app/forms";
    import { Plus, Trash2 } from "lucide-svelte";
    import { _ } from "svelte-i18n";

    let { data, form } = $props();
    let showCreateModal = $state(false);
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.settings.usersPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.settings.usersPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => (showCreateModal = !showCreateModal)}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            <Plus class="w-4 h-4" />
            {$_("modules.settings.usersPage.addUser")}
        </button>
    </div>

    {#if showCreateModal}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 class="text-xl font-bold mb-4">
                    {$_("modules.settings.usersPage.newUser")}
                </h2>
                <form method="POST" action="?/create" use:enhance>
                    <div class="space-y-4">
                        <div>
                            <label
                                for="name"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.settings.usersPage.fullName",
                                )}</label
                            >
                            <input
                                type="text"
                                name="name"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label
                                for="email"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.settings.usersPage.email")}</label
                            >
                            <input
                                type="email"
                                name="email"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label
                                for="password"
                                class="block text-sm font-medium text-gray-700"
                                >{$_(
                                    "modules.settings.usersPage.password",
                                )}</label
                            >
                            <input
                                type="password"
                                name="password"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label
                                for="role"
                                class="block text-sm font-medium text-gray-700"
                                >{$_("modules.settings.usersPage.role")}</label
                            >
                            <select
                                name="role"
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            >
                                <option value="VIEWER"
                                    >{$_(
                                        "modules.settings.usersPage.roles.VIEWER",
                                    )}</option
                                >
                                <option value="HR_OFFICER"
                                    >{$_(
                                        "modules.settings.usersPage.roles.HR_OFFICER",
                                    )}</option
                                >
                                <option value="WAREHOUSE_MANAGER"
                                    >{$_(
                                        "modules.settings.usersPage.roles.WAREHOUSE_MANAGER",
                                    )}</option
                                >
                                <option value="ACCOUNTANT"
                                    >{$_(
                                        "modules.settings.usersPage.roles.ACCOUNTANT",
                                    )}</option
                                >
                                <option value="ADMIN"
                                    >{$_(
                                        "modules.settings.usersPage.roles.ADMIN",
                                    )}</option
                                >
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
                            >{$_("modules.settings.usersPage.cancel")}</button
                        >
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >{$_("modules.settings.usersPage.save")}</button
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
                        >{$_("modules.settings.usersPage.name")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.settings.usersPage.email")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.settings.usersPage.role")}</th
                    >
                    <th
                        scope="col"
                        class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{$_("modules.settings.usersPage.actions")}</th
                    >
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each data.users as user}
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">
                                {user.name}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-500">
                                {user.email}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                            >
                                {$_(
                                    `modules.settings.usersPage.roles.${user.role}`,
                                )}
                            </span>
                        </td>
                        <td
                            class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium"
                        >
                            {#if user.email !== data.currentUserEmail}
                                <form
                                    action="?/delete"
                                    method="POST"
                                    use:enhance
                                    class="inline-block"
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={user.id}
                                    />
                                    <button
                                        type="submit"
                                        class="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </form>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
