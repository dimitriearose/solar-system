<script lang="ts">
  import { onMount } from 'svelte'
  import Loader from './Loader.svelte'

  export let percentage: number

  let loadingScreen: HTMLDivElement = null

  $: {
    if (loadingScreen) {
      loadingScreen.style.width = `${percentage}%`
    }
  }
  onMount(() => {})
</script>

<div class="container">
  <div bind:this={loadingScreen} class="loading">
    <h1>{percentage.toFixed(0)}%</h1>
  </div>
</div>

<style lang="scss">
  .container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    background-color: #f7f7f7;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .loading {
    background-color: #111;
    width: 50%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.1s ease-in-out;

    & h1 {
      font-size: 5rem;
      color: #f7f7f7;
    }
  }
</style>
