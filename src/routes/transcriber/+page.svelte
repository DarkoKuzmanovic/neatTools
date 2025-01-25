<script lang="ts">
  import { writable } from "svelte/store";
  import { marked } from "marked";
  import { googleApiKey } from "$lib/stores";

  let fileInput: HTMLInputElement;
  let audioElement: HTMLAudioElement;
  let selectedFile: File | null = null;
  let dragOver = false;
  let loading = false;
  let error = "";
  let transcription = "";
  let showMarkdown = false;
  let showSettings = false;
  let showApiSettings = false;

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
    if (!$googleApiKey) {
      error = "Please set your Google API key in settings first";
      return;
    }
    loading = true;
    error = "";

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("systemPrompt", $systemPrompt);
      formData.append("temperature", $temperature.toString());
      formData.append("apiKey", $googleApiKey);

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

  function toggleApiSettings() {
    showApiSettings = !showApiSettings;
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

<div class="space-y-6 transcriber-container">
  <header class="space-y-2 text-center transcriber-header">
    <h1 class="h1">Transcriber</h1>
    <p class="text-lg opacity-75">Convert your audio files to text using AI. Supports various audio formats.</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 transcriber-main-content">
    <!-- Input Section -->
    <div class="card p-4 space-y-4 transcriber-input-section">
      <div class="flex justify-between items-center transcriber-input-header">
        <h2 class="h3">Audio Input</h2>
        <div class="flex gap-2 transcriber-input-buttons">
          <button class="btn variant-soft transcriber-settings-button" on:click={toggleSettings} title="AI Settings">
            <i class="fas fa-cog text-lg"></i>
          </button>
          <button
            class="btn variant-filled-secondary hover:variant-filled-primary transcriber-upload-button"
            on:click={() => fileInput?.click()}
          >
            <i class="fas fa-upload mr-2"></i> Upload File
          </button>
          <button
            class="btn variant-soft transcriber-api-settings-button"
            on:click={toggleApiSettings}
            title="API Settings"
          >
            <i class="fas fa-key text-lg"></i>
          </button>
        </div>
        <input type="file" accept="audio/*" class="hidden" on:change={handleFileInput} bind:this={fileInput} />
      </div>

      {#if showSettings}
        <div class="card variant-soft p-4 space-y-4 transcriber-settings-panel">
          <div class="space-y-2">
            <label class="label">
              <span>System Prompt</span>
              <textarea
                class="textarea w-full transcriber-system-prompt-textarea"
                rows="3"
                bind:value={$systemPrompt}
                placeholder="Enter system prompt for the AI..."
              />
            </label>
          </div>
          <div class="space-y-2">
            <label class="label">
              <span>Temperature ({$temperature})</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                class="range transcriber-temperature-range"
                bind:value={$temperature}
              />
            </label>
          </div>
        </div>
      {/if}

      {#if showApiSettings}
        <div class="card variant-soft p-4 space-y-4 transcriber-api-settings-panel">
          <div class="space-y-2">
            <label class="label">
              <span>Google API Key</span>
              <input
                type="password"
                class="input"
                bind:value={$googleApiKey}
                placeholder="Enter your Google API key..."
              />
            </label>
            <p class="text-sm opacity-75">
              Your API key is stored locally in your browser and is never sent to our servers.
              <a href="https://ai.google.dev/tutorials/setup" target="_blank" rel="noopener noreferrer" class="anchor">
                Learn how to get an API key
              </a>
            </p>
          </div>
        </div>
      {/if}

      <!-- Drag and Drop Area -->
      <div
        class="relative transcriber-drag-drop-area"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
      >
        <div
          class="h-[625px] w-full rounded-container-token border-2 border-dashed border-surface-500 flex items-center justify-center {dragOver
            ? 'variant-soft-primary'
            : ''} transcriber-drag-drop-zone"
        >
          {#if selectedFile}
            <div class="text-center transcriber-selected-file-info">
              <p class="text-lg font-semibold mb-2">{selectedFile.name}</p>
              <button
                class="btn variant-filled-secondary hover:variant-filled-primary transcriber-start-button"
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
            <p class="text-lg font-semibold transcriber-drag-drop-prompt">
              <i class="fas fa-file-audio mr-2"></i>
              Drag & drop an audio file here
            </p>
          {/if}
        </div>
      </div>
    </div>

    <!-- Output Section -->
    <div class="card p-4 space-y-4 transcriber-output-section">
      <div class="flex justify-between items-center transcriber-output-header">
        <h2 class="h3">Transcription</h2>
        <div class="flex gap-2 transcriber-output-buttons">
          <button
            class="btn variant-soft transcriber-preview-button"
            on:click={togglePreview}
            disabled={!transcription}
            title={showMarkdown ? "Show Plain Text" : "Show Markdown"}
          >
            <i class="fas fa-code text-lg"></i>
          </button>
          <button
            class="btn variant-soft transcriber-download-txt-button"
            on:click={() => downloadTranscription("txt")}
            disabled={!transcription}
            title="Download as TXT"
          >
            <i class="fas fa-file-alt text-lg"></i>
          </button>
          <button
            class="btn variant-soft transcriber-download-md-button"
            on:click={() => downloadTranscription("md")}
            disabled={!transcription}
            title="Download as Markdown"
          >
            <i class="fas fa-file-code text-lg"></i>
          </button>
        </div>
      </div>

      {#if error}
        <div class="alert variant-filled-error transcriber-error-message">
          <i class="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      {/if}
      <div class="h-[625px] overflow-auto transcriber-output-content">
        {#if loading}
          <div class="flex items-center justify-center h-full transcriber-loading-indicator">
            <i class="fas fa-spinner fa-spin text-4xl"></i>
          </div>
        {:else if transcription}
          <div class="prose dark:prose-invert transcriber-transcription-output">
            {#if showMarkdown}
              {@html marked(transcription)}
            {:else}
              <pre class="whitespace-pre-wrap">{transcription}</pre>
            {/if}
          </div>
        {:else}
          <div class="flex items-center justify-center h-full text-surface-500 transcriber-empty-state">
            <p>Transcription will appear here</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
