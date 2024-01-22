<script lang="ts">
    interface Annotation {
        bg?: string;
        bg_opacity?: number;
        fg?: string;
    }

    export let text = "hello world?";
    export let annotations: Annotation[] = [];

    let inputField: HTMLInputElement;

    const annotFillDefaults = (a: Annotation): Annotation => ({
        bg: "transparent",
        bg_opacity: 100,
        fg: "",
        ...a,
    });
    const annotAt: (i: number) => Annotation | null = (i) =>
        annotations.length > i ?
            annotFillDefaults(annotations[i]) :
            null;

    let fgWidth: number;
    $: if (inputField && fgWidth) {
        inputField.style.width = `${text.length * fgWidth}px`;
    }
</script>

<div id="AnnotTextField" class="relative">
    <input
        bind:this={inputField}
        bind:value={text}
        on:scroll={() => inputField.scrollLeft = 0}
        class="mono z-20 text-transparent tl"/>

<!-- Backing element  -->

    <div id="backing">
<!--        FG text   -->
        <span class="tl">
            {#each text as letter, i}
                {#key annotations}
                    <span
                            bind:offsetWidth={fgWidth}
                            style={`
                           color: ${annotAt(i)?.fg};
                        `}
                            class="z-10 mono"
                    >{letter}</span>
                {/key}
            {/each}
        </span>

<!--        BG    -->
        <span>
            {#each text as letter, i}
                {#key annotations}
                    <span
                            style={`
                           background-color: ${annotAt(i)?.bg};
                           filter: opacity(${annotAt(i)?.bg_opacity}%);
                        `}
                            class="mono text-transparent"
                    >{letter}</span>
                {/key}
            {/each}
        </span>
    </div>

</div>

<style lang="postcss">
    input {
        caret-color: white;
    }

    .tl {
        @apply absolute top-0 left-0;
    }

    .mono {
        @apply font-mono text-xl text-center whitespace-pre;
        letter-spacing: 4px;
    }

    #backing > span {
        @apply mono select-none;
    }
</style>