<script>
  const tools = [
    {
      title: "ZPL Reader",
      description: "Preview and validate ZPL (Zebra Programming Language) code",
      path: "/zpl-reader",
      icon: "🏷️",
    },
    {
      title: "Transcriber",
      description: "Convert speech to text with ease",
      path: "/transcriber",
      icon: "🎙️",
    },
  ];
</script>

<div class="space-y-8">
  <header class="text-center space-y-4">
    <h1 class="h1">Welcome to neatTools</h1>
    <p class="text-xl opacity-75">A collection of handy utilities to make your work easier</p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each tools as tool}
      <a href={tool.path} class="card p-6 hover:scale-102 transition-transform duration-200 hover:variant-soft-primary">
        <header class="flex items-center gap-3">
          <span class="text-4xl">{tool.icon}</span>
          <h2 class="h3">{tool.title}</h2>
        </header>
        <p class="mt-4 opacity-75">{tool.description}</p>
      </a>
    {/each}
  </div>
</div>
