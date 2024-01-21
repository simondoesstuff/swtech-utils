<script lang="ts">
    import AnnotTextField from "./comps/AnnotTextField.svelte";
    import {evidenceIndexQuery, tokenIdFreqMany} from "$lib/could_align/could_align";

    let queries: string[] = ['hello world?']
    let evidence: string[] = ['hey world!'];
    $: queries = queries.filter(q => q.length > 0);
    $: evidence = evidence.filter(e => e.length > 0);

    let tokenSize = 2;
    function parseInput(event: InputEvent) {
        const data = event.data;
        if (data) {
            const num = parseInt(data);
            if (num) {
                tokenSize = num;
            }
        }
    }

    $: evTokens = tokenIdFreqMany(evidence, tokenSize);
    $: qScores = queries.map(q => evidenceIndexQuery(q, evTokens, tokenSize));
    $: annotations = qScores.map((scores) =>
        scores.map((score: number) => {
            let color = score > .1 ? [0, 1, .2] : [1, 0, .2];
            color = color.map(c => Math.floor(c * 255));
            return {
                fg: score <= .5 ? 'white' : 'black',
                bg: `rgb(${color.join(',')})`,
                bg_opacity: .9 * Math.max(Math.min(score * 100, 100), 20)
            }
        }));

    function checkSelection(loc: 'queries' | 'evidence') {
        const sel = window.getSelection()?.toString();
        let target = loc == 'queries' ? queries : evidence;

        if (sel) {
            target.push(sel);
            target = target;
            queries = queries;
            evidence = evidence;
        }
    }
</script>

<main class="m-5 lg:m-10">
    <span class="w-full">
        <span>Token Size: </span>
        <span class="font-bold">
            <input
                class="p-1 pb-3 w-10"
                on:input={parseInput}
                value={tokenSize}
            />
        </span>
    </span>

    <div
        id="queries"
        class="mb-[7vh]"
    >
        <div
            class="annotBlock"
            on:mouseup={() => checkSelection('queries')}
        >
            {#each queries as _, i}
                <div>
                    <AnnotTextField
                        bind:text={queries[i]}
                        bind:annotations={annotations[i]}
                    />
                </div>
            {/each}
        </div>
    </div>

    <div
        id="evidence"
        class="annotBlock"
        on:mouseup={() => checkSelection('evidence')}
    >
        {#each evidence as _, i}
            <div>
                <AnnotTextField
                    bind:text={evidence[i]}
                    annotations={[]}
                />
            </div>
        {/each}
    </div>
</main>

<style lang="postcss">
    .annotBlock {
        @apply w-full flex justify-center gap-3 md:gap-7 flex-wrap;

        div {
            @apply border border-primary-300 p-0.5 px-1;
        }
    }
</style>