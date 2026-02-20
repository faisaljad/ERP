<script lang="ts">
    import { enhance } from "$app/forms";
    let { form } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div
        class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100"
    >
        <div class="text-center">
            <h2 class="mt-6 text-3xl font-bold text-gray-900">
                Sign in to ERP
            </h2>
            <p class="mt-2 text-sm text-gray-600">
                Enter your credentials to access the system
            </p>
        </div>

        <form class="mt-8 space-y-6" method="POST" use:enhance>
            <div class="rounded-md shadow-sm -space-y-px">
                <div class="mb-4">
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Email address</label
                    >
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                        placeholder="admin@erp.com"
                    />
                </div>
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Password</label
                    >
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                        placeholder="password"
                    />
                </div>
            </div>

            {#if form?.error}
                <div
                    class="text-red-500 text-sm text-center bg-red-50 p-2 rounded"
                >
                    {form.error}
                </div>
            {/if}

            <div>
                <button
                    type="submit"
                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    Sign in
                </button>
            </div>
        </form>
    </div>
</div>
