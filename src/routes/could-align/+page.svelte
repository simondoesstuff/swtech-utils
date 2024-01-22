<script lang="ts">
    import AnnotTextField from "./comps/AnnotTextField.svelte";
    import {evidenceIndexQuery, tokenIdFreqMany} from "$lib/could_align/could_align";
    import Float from "./comps/Float.svelte";

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

    /////////////////////////   Primary Algorithm   /////////////////////////

    let timing = [0, 0];
    let annotations: any[] = [];
    async function reevaluate() {
        console.log('reeval')

        let t0 = performance.now();
        const evTokens = tokenIdFreqMany(evidence, tokenSize);
        let t1 = performance.now();
        const qScores = queries.map(q => evidenceIndexQuery(q, evTokens, tokenSize));

        timing = [
            t1 - t0,
            performance.now() - t1
        ];

        annotations = qScores.map((scores) =>
            scores.map((score: number) => {
                let color = score > .1 ? [0, 1, .2] : [1, 0, .2];
                color = color.map(c => Math.floor(c * 255));
                return {
                    fg: score <= .5 ? 'white' : 'black',
                    bg: `rgb(${color.join(',')})`,
                    bg_opacity: .9 * Math.max(Math.min(score * 100, 100), 20)
                }
            }));
    }

    /////////////////////////   Cooldown System   /////////////////////////

    let evalLast: number = 0;
    let evalTimeout: NodeJS.Timeout | null;
    const evalTimeoutTime = 250;
    function evalTimer() {
        if (evalTimeout) clearTimeout(evalTimeout);

        if (performance.now() - evalLast > evalTimeoutTime) {
            reevaluate();
        } else {
            evalTimeout = setTimeout(() => {
                evalTimer()
            }, evalTimeoutTime);
        }

        evalLast = performance.now();
    }

    $: if (evidence || queries || tokenSize) evalTimer();
    evalTimer();

    /////////////////////////   Float   /////////////////////////

    let floatPos: [number, number];
    let floatOpen = false;
    let floatResolve: (r: 'up' | 'down' | 'close') => void;
    let floatCancel: () => void = () => {};

    async function checkSelection(event: MouseEvent) {
        const sel = window.getSelection()?.toString();

        if (sel) {
            floatOpen = true;
            floatPos = [event.clientX, event.clientY];

            try {
                floatCancel();
                const promise = new Promise<'up' | 'down' | 'close'>(
                    (r, c) => {
                        floatResolve = r
                        floatCancel = c
                    });

                const resp = await promise;
                floatOpen = false;

                if (resp === 'up') {
                    queries.push(sel);
                    queries = queries;
                } else if (resp === 'down') {
                    evidence.push(sel);
                    evidence = evidence;
                }
            } catch (_) {}
        }
    }
</script>


<Float open={floatOpen} resolve={floatResolve} pos={floatPos}/>

<main class="m-5 lg:m-10">
    <span class="flex flex-col justify-between w-full m-2">
        <div>
            <span>Token Size: </span>
            <span class="font-bold">
                <input
                    class="pl-2 w-10"
                    on:input={parseInput}
                    value={tokenSize}
                />
            </span>
        </div>
        <div>
            <span>Index, Query: </span>
            <span class="font-bold">
                {`${timing[0].toFixed(1)}, ${timing[1].toFixed(1)} ms`}
            </span>
        </div>
    </span>

    <div
        id="queries"
        class="mb-[7vh]"
    >
        <div
            class="annotBlock"
            on:mouseup={checkSelection}
        >
            {#each queries as q, i}
                {#if q}
                    <div>
                        <AnnotTextField
                            bind:text={q}
                            bind:annotations={annotations[i]}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>

    <div
        id="evidence"
        class="annotBlock"
        on:mouseup={checkSelection}
    >
        {#each evidence as e}
            {#if e}
                <div>
                    <AnnotTextField
                        bind:text={e}
                        annotations={[]}
                    />
                </div>
            {/if}
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