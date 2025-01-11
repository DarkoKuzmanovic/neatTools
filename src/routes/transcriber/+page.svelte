<script lang="ts">
  import { writable } from "svelte/store";
  import { marked } from "marked";

  let fileInput: HTMLInputElement;
  let audioElement: HTMLAudioElement;
  let selectedFile: File | null = null;
  let dragOver = false;
  let loading = false;
  let error = "";
  let transcription = "";
  let showMarkdown = false;
  let showSettings = false;

  // AI Settings
  let systemPrompt = writable(
    "Generate audio diarization, including transcriptions and speaker information for each transcription, for this interview. Organize the transcription by the time they happened."
  );
  let temperature = writable(0.6);

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    dragOver = true;
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    dragOver = false;
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    dragOver = false;
    if (!event.dataTransfer?.files.length) return;
    selectedFile = event.dataTransfer.files[0];
  };

  const handleFileInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;
    selectedFile = target.files[0];
  };

  const startTranscription = async () => {
    if (!selectedFile) return;
    loading = true;
    error = "";

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("systemPrompt", $systemPrompt);
      formData.append("temperature", $temperature.toString());

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      transcription = data.text;
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading = false;
    }
  };

  function togglePreview() {
    showMarkdown = !showMarkdown;
  }

  function toggleSettings() {
    showSettings = !showSettings;
  }

  function downloadTranscription(format: "txt" | "md") {
    if (!transcription) return;

    let content = transcription;
    let mimeType = "text/plain";
    let extension = "txt";

    if (format === "md") {
      content = `# Transcription\n\n${transcription}`;
      mimeType = "text/markdown";
      extension = "md";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="space-y-6">
  <header class="space-y-2 text-center">
    <h1 class="h1">Transcriber</h1>
    <p class="text-lg opacity-75">Convert your audio files to text using AI. Supports various audio formats.</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Input Section -->
    <div class="card p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="h3">Audio Input</h2>
        <div class="flex gap-2">
          <button class="btn variant-soft" on:click={toggleSettings} title="AI Settings">
            <i class="fas fa-cog text-lg"></i>
          </button>
          <button class="btn variant-filled-secondary hover:variant-filled-primary" on:click={() => fileInput?.click()}>
            <i class="fas fa-upload mr-2"></i> Upload File
          </button>
        </div>
        <input type="file" accept="audio/*" class="hidden" on:change={handleFileInput} bind:this={fileInput} />
      </div>

      {#if showSettings}
        <div class="card variant-soft p-4 space-y-4">
          <div class="space-y-2">
            <label class="label">
              <span>System Prompt</span>
              <textarea
                class="textarea w-full"
                rows="3"
                bind:value={$systemPrompt}
                placeholder="Enter system prompt for the AI..."
              />
            </label>
          </div>
          <div class="space-y-2">
            <label class="label">
              <span>Temperature ({$temperature})</span>
              <input type="range" min="0" max="1" step="0.1" class="range" bind:value={$temperature} />
            </label>
          </div>
        </div>
      {/if}

      <!-- Drag and Drop Area -->
      <div class="relative" on:dragover={handleDragOver} on:dragleave={handleDragLeave} on:drop={handleDrop}>
        <div
          class="h-[625px] w-full rounded-container-token border-2 border-dashed border-surface-500 flex items-center justify-center {dragOver
            ? 'variant-soft-primary'
            : ''}"
        >
          {#if selectedFile}
            <div class="text-center">
              <p class="text-lg font-semibold mb-2">{selectedFile.name}</p>
              <button
                class="btn variant-filled-secondary hover:variant-filled-primary"
                on:click={startTranscription}
                disabled={loading}
              >
                {#if loading}
                  <i class="fas fa-spinner fa-spin mr-2"></i> Transcribing...
                {:else}
                  <i class="fas fa-play mr-2"></i> Start Transcription
                {/if}
              </button>
            </div>
          {:else}
            <p class="text-lg font-semibold">
              <i class="fas fa-file-audio mr-2"></i>
              Drag & drop an audio file here
            </p>
          {/if}
        </div>
      </div>
    </div>

    <!-- Output Section -->
    <div class="card p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="h3">Transcription</h2>
        <div class="flex gap-2">
          <button
            class="btn variant-soft"
            on:click={togglePreview}
            disabled={!transcription}
            title={showMarkdown ? "Show Plain Text" : "Show Markdown"}
          >
            <i class="fas fa-code text-lg"></i>
          </button>
          <button
            class="btn variant-soft"
            on:click={() => downloadTranscription("txt")}
            disabled={!transcription}
            title="Download as TXT"
          >
            <i class="fas fa-file-alt text-lg"></i>
          </button>
          <button
            class="btn variant-soft"
            on:click={() => downloadTranscription("md")}
            disabled={!transcription}
            title="Download as Markdown"
          >
            <i class="fas fa-file-code text-lg"></i>
          </button>
        </div>
      </div>

      {#if error}
        <div class="alert variant-filled-error">
          <i class="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      {/if}
      <div class="h-[625px] overflow-auto">
        {#if loading}
          <div class="flex items-center justify-center h-full">
            <i class="fas fa-spinner fa-spin text-4xl"></i>
          </div>
        {:else if transcription}
          <div class="prose dark:prose-invert">
            {#if showMarkdown}
              {@html marked(transcription)}
            {:else}
              <pre class="whitespace-pre-wrap">{transcription}</pre>
            {/if}
          </div>
        {:else}
          <div class="flex items-center justify-center h-full text-surface-500">
            <p>Transcription will appear here</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
