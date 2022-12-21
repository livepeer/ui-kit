<script>
  import svelteLogo from './assets/svelte.svg';
  import Video from './lib/Video.svelte';
</script>

<main>
  <div>
    <a href="https://svelte.dev" target="_blank">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>livepeer.js + Svelte</h1>

  <div class="card">
    <Video />
  </div>

  <p>
    Check out <a href="https://docs.livepeer.org" target="_blank">livepeer.js</a
    > to learn more!
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
