<script>
  import "../app.postcss";
  import { AppShell, AppBar } from "@skeletonlabs/skeleton";
  import { initializeStores } from "@skeletonlabs/skeleton";

  // Initialize the Skeleton stores
  initializeStores();

  // Dark mode handling
  let darkMode = false;

  // Check system preference on load
  if (typeof window !== "undefined") {
    darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", darkMode);
  }

  function toggleTheme() {
    darkMode = !darkMode;
    document.documentElement.classList.toggle("dark", darkMode);
  }
</script>

<AppShell class="bg-surface-50-900-token">
  <svelte:fragment slot="header">
    <AppBar class="bg-surface-100-800-token border-b border-surface-500/30">
      <svelte:fragment slot="lead">
        <a href="/" class="flex items-center space-x-2">
          <i class="fas fa-tools text-3xl"></i>
          <h1 class="text-2xl font-bold">neatTools</h1>
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <button
          class="btn btn-sm variant-soft hover:variant-filled-primary"
          on:click={toggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <i class="fas {darkMode ? 'fa-sun' : 'fa-moon'} mr-1"></i>
          {darkMode ? "Light" : "Dark"}
        </button>
        <a href="/" class="btn btn-sm variant-soft hover:variant-filled-primary">Home</a>
        <a
          href="https://github.com/DarkoKuzmanovic/neatTools"
          class="btn btn-sm variant-soft hover:variant-filled-primary"
        >
          <i class="fab fa-github mr-1"></i> GitHub
        </a>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <main class="container mx-auto p-4 space-y-8 mb-16">
    <slot />
  </main>

  <svelte:fragment slot="footer">
    <div class="container mx-auto p-4 text-center border-t border-surface-500/30">
      <p class="text-sm opacity-75">
        Made with <i class="fas fa-laptop-code"></i> and <i class="fas fa-mug-hot"></i> by
        <a href="https://github.com/DarkoKuzmanovic" class="anchor">Darko Kuzmanović</a>
      </p>
    </div>
  </svelte:fragment>
</AppShell>
