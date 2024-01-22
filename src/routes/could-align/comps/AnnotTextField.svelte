<script lang="ts">
    interface Annotation {
        bg?: string;
        bg_opacity?: number;
        fg?: string;
    }

    export let text = "hello world?";
    export let annotations: Annotation[] = [];

    let inputField: HTMLInputElement;

    let fgWidth: number;
    $: if (inputField && fgWidth) {
        inputField.style.width = `${text.length * fgWidth}px`;
    }

    let elFg: HTMLSpanElement[] = [];
    let elBg: HTMLSpanElement[] = [];
    $: for (let i = 0; i < text.length; i++) {
        if (!elFg[i] || !elBg[i]) continue;
        annotations[i] ??= {};
        elFg[i].style.color = annotations[i].fg ?? "white";
        elBg[i].style.backgroundColor = annotations[i].bg ?? "transparent";
        elBg[i].style.opacity = (annotations[i].bg_opacity ?? 1).toString();
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
            {#each text as letter, i (i)}
                <span
                    bind:offsetWidth={fgWidth}
                    bind:this={elFg[i]}
                    class="z-10 mono"
                >{letter}</span>
            {/each}
        </span>

<!--        BG    -->
        <span>
            {#each text as letter, i (i)}
                <span
                    bind:this={elBg[i]}
                    class="mono text-transparent"
                >{letter}</span>
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