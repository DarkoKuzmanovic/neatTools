<script lang="ts">
  import { writable } from "svelte/store";

  const zplCode = writable("");
  const rotation = writable(180);
  const zoom = writable(1);
  const dpi = writable(300);
  let dragOver = false;
  let loading = false;
  let error: string | null = null;
  let previewBlob: Blob | null = null;
  let fileInput: HTMLInputElement;

  async function updatePreview(zpl: string) {
    if (!zpl.trim()) {
      error = null;
      previewBlob = null;
      return null;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch(`https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/`, {
        method: "POST",
        headers: {
          Accept: "image/png",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: zpl,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      previewBlob = await response.blob();
      return URL.createObjectURL(previewBlob);
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to generate preview";
      previewBlob = null;
      return null;
    } finally {
      loading = false;
    }
  }

  async function downloadPreview() {
    if (!previewBlob) return;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(previewBlob);
    a.download = "label-preview.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  async function copyToClipboard() {
    if (!previewBlob) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": previewBlob,
        }),
      ]);
    } catch (e) {
      error = "Failed to copy to clipboard. Your browser may not support this feature.";
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        zplCode.set(e.target?.result?.toString() || "");
      };
      reader.readAsText(file);
    }
  }

  function handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        zplCode.set(e.target?.result?.toString() || "");
      };
      reader.readAsText(file);
    }
  }

  function rotatePreview() {
    rotation.update((r) => (r + 90) % 360);
  }

  function zoomIn() {
    zoom.update((z) => Math.min(z + 0.25, 3));
  }

  function zoomOut() {
    zoom.update((z) => Math.max(z - 0.25, 0.25));
  }

  let previewUrl: string | null = null;
  $: {
    if ($zplCode) {
      updatePreview($zplCode).then((url) => {
        if (url) previewUrl = url;
      });
    } else {
      previewUrl = null;
    }
  }

  // Cleanup object URL on component destroy
  import { onDestroy } from "svelte";
  onDestroy(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  });
</script>

<div class="space-y-6">
  <header class="space-y-2 text-center">
    <h1 class="h1">ZPL Reader</h1>
    <p class="text-lg opacity-75">
      Preview and validate ZPL (Zebra Programming Language) code. Preview is automatically rotated for readability.
    </p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Input Section -->
    <div class="card p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="h3">ZPL Code</h2>
        <button class="btn variant-filled-secondary hover:variant-filled-primary" on:click={() => fileInput?.click()}>
          <i class="fas fa-upload mr-2"></i> Upload File
        </button>
        <input type="file" accept=".zpl,.txt" class="hidden" on:change={handleFileInput} bind:this={fileInput} />
      </div>

      <!-- Drag and Drop Area -->
      <div class="relative" on:dragover={handleDragOver} on:dragleave={handleDragLeave} on:drop={handleDrop}>
        <textarea
          class="textarea h-[625px] w-full {dragOver ? 'variant-soft-primary' : ''}"
          placeholder="Paste your ZPL code here or drag & drop a file..."
          bind:value={$zplCode}
        ></textarea>
        {#if dragOver}
          <div
            class="absolute inset-0 border-2 border-dashed border-primary-500 bg-primary-500/10 rounded-container-token flex items-center justify-center"
          >
            <p class="text-lg font-semibold">
              <i class="fas fa-file-import mr-2"></i>
              Drop your file here
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Preview Section -->
    <div class="card p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="h3">Preview</h2>
        <div class="flex gap-2">
          <button class="btn variant-soft" on:click={copyToClipboard} disabled={!previewBlob} title="Copy to Clipboard">
            <i class="far fa-clipboard text-lg"></i>
          </button>
          <button class="btn variant-soft" on:click={downloadPreview} disabled={!previewBlob} title="Download PNG">
            <i class="fas fa-download text-lg"></i>
          </button>
          <button class="btn variant-soft" on:click={zoomOut} title="Zoom Out">
            <i class="fas fa-search-minus text-lg"></i>
          </button>
          <button class="btn variant-soft" on:click={zoomIn} title="Zoom In">
            <i class="fas fa-search-plus text-lg"></i>
          </button>
          <button class="btn variant-soft" on:click={rotatePreview} title="Rotate">
            <i class="fas fa-sync-alt text-lg"></i>
          </button>
        </div>
      </div>

      <div
        class="bg-surface-100-800-token rounded-container-token h-[625px] overflow-hidden flex items-center justify-center"
      >
        {#if loading}
          <div class="flex flex-col items-center gap-4">
            <div class="spinner-overlay" />
            <p>Generating preview...</p>
          </div>
        {:else if error}
          <div class="text-center p-4 space-y-2">
            <i class="fas fa-exclamation-triangle text-4xl text-error-500"></i>
            <p class="text-error-500">{error}</p>
          </div>
        {:else if previewUrl}
          <div
            class="relative w-full h-full flex items-center justify-center"
            style="transform: rotate({$rotation}deg) scale({$zoom}); transform-origin: center center;"
          >
            <img src={previewUrl} alt="ZPL Preview" class="max-w-full max-h-full object-contain" />
          </div>
        {:else}
          <div class="flex items-center justify-center h-full text-center p-4">
            <div class="space-y-3">
              <i class="fas fa-tags text-4xl opacity-50"></i>
              <p>Enter ZPL code or upload a file to see the preview</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .spinner-overlay {
    width: 50px;
    height: 50px;
    border: 5px solid #e2e8f0;
    border-top: 5px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
