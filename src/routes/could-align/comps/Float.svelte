<script lang="ts">
    export let open = true;
    export let pos = [100, 90];
    export let resolve: (value: 'up' | 'down' | 'close') => void;

    let el: HTMLDivElement;

    $: if (el && pos) {
        const size = [el.offsetWidth, el.offsetHeight];
        const target = [pos[0] - size[0] / 2, pos[1] + size[1] / 2];
        el.style.transform = `translate(${target[0]}px, ${target[1]}px)`;
    }
</script>

{#if open}
    <div
        bind:this={el}
        class="absolute z-30 top-0 left-0 grid place-items-center"
    >
        <div class="float">
            <button on:click={() => resolve('up')}>
                ☝️
            </button>
            <button on:click={() => resolve('down')}>
                👇
            </button>
        </div>
    </div>

<!--    Backdrop for closing float    -->
    <div
        class="absolute top-0 left-0 w-screen h-screen overflow-clip"
        on:click={() => resolve('close')}
    >
    </div>
{/if}

<style lang="postcss">
    .float {
        @apply rounded bg-primary-500 p-0.5 bg-opacity-50;
    }

    button {
        @apply hover:bg-primary-300 hover:scale-90 transition-transform;
        @apply border border-primary-300 rounded p-1;
        @apply opacity-50 hover:opacity-100;
    }
</style>