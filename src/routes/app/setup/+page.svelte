<script lang="ts">
    import { enhance } from "$app/forms";
    import { _ } from "svelte-i18n";
    let { form } = $props();
</script>

<div class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
            {$_("modules.setup.title")}
        </h1>
        <p class="mt-2 text-gray-600">
            {$_("modules.setup.subtitle")}
        </p>
    </div>

    <form
        method="POST"
        use:enhance
        class="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
    >
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-4">
                <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >{$_("modules.setup.companyName")}</label
                >
                <div class="mt-1">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="My Awesome Company"
                    />
                </div>
            </div>

            <div class="sm:col-span-6">
                <label
                    for="address"
                    class="block text-sm font-medium text-gray-700"
                    >{$_("modules.setup.address")}</label
                >
                <div class="mt-1">
                    <textarea
                        id="address"
                        name="address"
                        rows="3"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    ></textarea>
                </div>
            </div>

            <div class="sm:col-span-3">
                <label
                    for="taxId"
                    class="block text-sm font-medium text-gray-700"
                    >{$_("modules.setup.taxId")}</label
                >
                <div class="mt-1">
                    <input
                        type="text"
                        name="taxId"
                        id="taxId"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                </div>
            </div>

            <div class="sm:col-span-3">
                <label
                    for="currency"
                    class="block text-sm font-medium text-gray-700"
                    >{$_("modules.setup.currency")}</label
                >
                <div class="mt-1">
                    <select
                        id="currency"
                        name="currency"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    >
                        <option value="JOD"
                            >{$_("modules.setup.currencies.JOD")}</option
                        >
                        <option value="USD"
                            >{$_("modules.setup.currencies.USD")}</option
                        >
                        <option value="EUR"
                            >{$_("modules.setup.currencies.EUR")}</option
                        >
                    </select>
                </div>
            </div>

            <div class="sm:col-span-6">
                <h3 class="text-lg font-medium text-gray-900">
                    {$_("modules.setup.accountingSetup")}
                </h3>
                <p class="text-sm text-gray-500 mb-4">
                    {$_("modules.setup.templateDesc")}
                </p>

                <div class="flex items-start">
                    <div class="flex items-center h-5">
                        <input
                            id="template"
                            name="template"
                            type="checkbox"
                            value="standard"
                            checked
                            class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                    </div>
                    <div class="ms-3 text-sm">
                        <label for="template" class="font-medium text-gray-700"
                            >{$_("modules.setup.useStandard")}</label
                        >
                        <p class="text-gray-500">
                            {$_("modules.setup.standardDesc")}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {#if form?.error}
            <div class="text-red-500 text-sm">{form.error}</div>
        {/if}

        <div class="pt-5 flex justify-end">
            <button
                type="submit"
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {$_("modules.setup.save")}
            </button>
        </div>
    </form>
</div>
