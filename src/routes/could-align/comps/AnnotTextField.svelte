<script lang="ts">
    interface Annotation {
        bg?: string;
        bg_opacity?: number;
        fg?: string;
    }

    export let text = "hello world?";

    let inputField: HTMLInputElement;

    let annotations: Annotation[];
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

    // todo: debug

    $: annotations = Array(text.length)
        .fill(null)
        .map((_, i) => ({
            bg: `${i % 3 == 0 ? "red" : "blue"}`,
            bg_opacity: i % 2 == 0 ? 50 : 100,
            fg: `${i % 3 == 1 ? "cyan" : ""}`,
        }));
</script>

<div id="AnnotTextField">
    <input
        bind:this={inputField}
        bind:value={text}
        on:scroll={() => inputField.scrollLeft = 0}
        class="absolute z-20 mono text-transparent"/>

<!-- Backing element  -->

    <div id="backing">
<!--        FG text   -->
        <span>
            {#each text as letter, i}
                <span
                    bind:offsetWidth={fgWidth}
                    style={`
                       color: ${annotAt(i)?.fg};
                    `}
                    class="z-10"
                >{letter}</span>
            {/each}
        </span>

<!--        BG    -->
        <span>
            {#each text as letter, i}
                <span
                    style={`
                       background-color: ${annotAt(i)?.bg};
                       filter: opacity(${annotAt(i)?.bg_opacity}%);
                    `}
                    class="text-transparent"
                >{letter}</span>
            {/each}
        </span>
    </div>

</div>

<style lang="postcss">
    input {
        caret-color: white;
    }

    .mono {
        @apply font-mono text-xl text-center;
        letter-spacing: 5px;
    }

    #backing > span {
        @apply absolute whitespace-pre mono;
    }
</style>