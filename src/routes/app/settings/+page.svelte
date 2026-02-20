<script lang="ts">
    import {
        Users,
        Building,
        Settings,
        Building2,
        MonitorPlay,
    } from "lucide-svelte";
    import { _ } from "svelte-i18n";
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">
            {$_("modules.settings.title")}
        </h1>
        <p class="text-gray-500">
            {$_("modules.settings.subtitle")}
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- User Management -->
        <a
            href="/app/settings/users"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <Users class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.settings.users")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.settings.usersDesc")}
            </p>
        </a>

        <!-- Branch Management -->
        <a
            href="/app/settings/branches"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <Building2 class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.settings.branches")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.settings.branchesDesc")}
            </p>
        </a>

        <!-- POS Registers -->
        <a
            href="/app/settings/pos-registers"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <MonitorPlay class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.settings.posRegisters")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.settings.posRegistersDesc")}
            </p>
        </a>

        <!-- Company Profile -->
        <a
            href="/app/setup"
            class="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
        >
            <div
                class="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
                <Building class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.settings.company")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.settings.companyDesc")}
            </p>
        </a>

        <!-- General Settings -->
        <div
            class="group bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full opacity-60"
        >
            <div
                class="w-12 h-12 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center mb-4"
            >
                <Settings class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
                {$_("modules.settings.general")}
            </h2>
            <p class="text-gray-500 text-sm">
                {$_("modules.settings.generalDesc")}
            </p>
        </div>
    </div>
</div>
