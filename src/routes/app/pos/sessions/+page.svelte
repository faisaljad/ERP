<script lang="ts">
    import { _ } from "svelte-i18n";
    import { enhance } from "$app/forms";
    import {
        Play,
        Square,
        Clock,
        MonitorPlay,
        AlertCircle,
    } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props<{ data: PageData }>();

    let isModalOpen = $state(false);
    let modalType = $state<"OPEN" | "CLOSE">("OPEN");
    let selectedSessionId = $state("");
    let newSessionData = $state({
        registerId: "",
        openingCash: "0",
    });
    let closingData = $state({
        closingCash: "0",
    });

    // Helper functions to format currency and time
    const formatCurrency = (amount: any) =>
        parseFloat(amount || "0").toFixed(2);
    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    function openModal(type: "OPEN" | "CLOSE", sessionId = "") {
        modalType = type;
        selectedSessionId = sessionId;
        if (type === "OPEN" && data.registers.length > 0) {
            newSessionData.registerId = data.registers[0].id;
        }
        isModalOpen = true;
    }

    function closeModal() {
        isModalOpen = false;
        selectedSessionId = "";
        newSessionData = { registerId: "", openingCash: "0" };
        closingData = { closingCash: "0" };
    }
</script>

<div class="space-y-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                {$_("modules.sales.sessionsPage.title")}
            </h1>
            <p class="text-gray-500">
                {$_("modules.sales.sessionsPage.subtitle")}
            </p>
        </div>
        <button
            onclick={() => openModal("OPEN")}
            disabled={data.registers.length === 0}
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Play class="w-4 h-4" />
            {$_("modules.sales.sessionsPage.openSession")}
        </button>
    </div>

    <!-- Active Sessions Grid -->
    {#if data.registers.length === 0}
        <div
            class="bg-yellow-50 text-yellow-800 p-4 rounded-xl flex items-start gap-3 border border-yellow-200"
        >
            <AlertCircle class="w-5 h-5 shrink-0 mt-0.5" />
            <p>{$_("modules.sales.sessionsPage.cannotOpen")}</p>
        </div>
    {/if}

    {#if data.activeSessions.length === 0}
        <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
        >
            <div
                class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
                <MonitorPlay class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">
                {$_("modules.sales.sessionsPage.noSessions")}
            </h3>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.activeSessions as session}
                <div
                    class="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden"
                >
                    <div
                        class="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center"
                    >
                        <div
                            class="flex items-center gap-2 font-medium text-blue-900"
                        >
                            <MonitorPlay class="w-4 h-4" />
                            {session.register.name}
                        </div>
                        <span
                            class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                        >
                            {$_("modules.sales.sessionsPage.openStatus")}
                        </span>
                    </div>

                    <div class="p-4 space-y-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500"
                                >{$_("modules.sales.sessionsPage.user")}:</span
                            >
                            <span class="font-medium text-gray-900"
                                >{session.user.name}</span
                            >
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500"
                                >{$_(
                                    "modules.sales.sessionsPage.startTime",
                                )}:</span
                            >
                            <span
                                class="font-medium text-gray-900 flex items-center gap-1"
                            >
                                <Clock class="w-3 h-3 text-gray-400" />
                                {formatTime(session.startTime.toString())}
                            </span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500"
                                >{$_(
                                    "modules.sales.sessionsPage.openingCash",
                                )}:</span
                            >
                            <span class="font-medium text-gray-900"
                                >{formatCurrency(session.openingCash)}</span
                            >
                        </div>

                        <div class="pt-4 border-t border-gray-100 flex gap-2">
                            <a
                                href={`/app/pos?sessionId=${session.id}`}
                                class="flex-1 text-center py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                            >
                                {$_("modules.sales.pos")}
                            </a>
                            <button
                                onclick={() => openModal("CLOSE", session.id)}
                                class="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition-colors"
                            >
                                <Square class="w-4 h-4 fill-current" />
                                {$_("modules.sales.sessionsPage.closeSession")}
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Add/Edit Modal -->
{#if isModalOpen}
    <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
        <div
            class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
        >
            <div
                class="px-6 py-4 border-b border-gray-100 flex justify-between items-center"
            >
                <h2 class="text-xl font-bold text-gray-900">
                    {modalType === "OPEN"
                        ? $_("modules.sales.sessionsPage.openSession")
                        : $_("modules.sales.sessionsPage.closeSession")}
                </h2>
                <button
                    onclick={closeModal}
                    class="text-gray-400 hover:text-gray-600"
                >
                    &times;
                </button>
            </div>

            <form
                method="POST"
                action="?/{modalType === 'OPEN'
                    ? 'openSession'
                    : 'closeSession'}"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === "success") {
                            closeModal();
                        }
                        await update();
                    };
                }}
                class="p-6 space-y-4"
            >
                {#if modalType === "OPEN"}
                    <div>
                        <label
                            for="registerId"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {$_("modules.sales.sessionsPage.register")} *
                        </label>
                        <select
                            name="registerId"
                            id="registerId"
                            bind:value={newSessionData.registerId}
                            required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                            {#each data.registers as register}
                                <option value={register.id}
                                    >{register.name} - {register.branch
                                        .name}</option
                                >
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label
                            for="openingCash"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {$_("modules.sales.sessionsPage.openingCash")}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="openingCash"
                            id="openingCash"
                            bind:value={newSessionData.openingCash}
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                            dir="ltr"
                        />
                    </div>
                {:else}
                    <input
                        type="hidden"
                        name="sessionId"
                        value={selectedSessionId}
                    />
                    <div>
                        <label
                            for="closingCash"
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {$_("modules.sales.sessionsPage.closingCash")}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="closingCash"
                            id="closingCash"
                            bind:value={closingData.closingCash}
                            required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                            dir="ltr"
                        />
                    </div>
                {/if}

                <div
                    class="pt-4 flex justify-end gap-3 border-t border-gray-100"
                >
                    <button
                        type="button"
                        onclick={closeModal}
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        {$_("modules.sales.sessionsPage.cancel")}
                    </button>
                    <button
                        type="submit"
                        class={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            modalType === "OPEN"
                                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        }`}
                    >
                        {$_("modules.sales.sessionsPage.submit")}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
