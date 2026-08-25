
<script >
// @ts-nocheck
    import { analyseText, dynamicValues, timingThresholds } from "./analyse.svelte";

    import Event from "./Event.svelte";


let source = $state(
`drawing or other Means
Of differentiation.
in Recent years we
re_a_lize That sound too
has its Own proportions.
properties Now become

Figures in celebrated
museum. Eventually
Left with the face of the
sun-Di_al whose hand travels
in those Moments when there is
Abundant light. still movement.
Nothing more than sound itself.

Mistake is in trying 
to view One's work at its
dynamic Rather 
Than a man-made history.
find Out its undoing.
Nothing more than a glove.`);
let piece = $state([]);
let showWords = $state(false);

$effect(() => piece = analyseText(source, {}))
</script>

  <h1>Kasemets-o-matic</h1>
  <div class="explanation">
    Enter source text below. Use initial capital to mark the centre word. 
    If you want to enforce a particular syllable break, use underscores. 
    (For example, Kasemets breaks 'realize' as 're-a-lize', whereas most syllabifiers break it as 're-al-ize')
   <div>
   </div>
  </div>
  <details>
    <summary>Data maps</summary>
    <div><b>Dynamics:</b></div>
    <div style="margin-bottom: 1em;">
      {#each Object.keys(dynamicValues) as letter}
        {letter}: <input type="text" style="width: 2em;" bind:value={dynamicValues[letter]} />
      {/each}
    </div>
    <div><b>Timing thresholds:</b></div>
    <div style="margin-bottom: 1em;">
      {#each Object.keys(timingThresholds) as key}
        {key}: <input type="number" style="width: 3em;" bind:value={timingThresholds[key]} />
      {/each}
    </div>
  </details>
  <textarea bind:value={source} rows={20} style="width: 80%;"></textarea>
  <div style="text-align: left; cursor: pointer;" on:click={e => showWords = !showWords}>
    <input type="checkbox" bind:checked={showWords} /> Show words always? (If unchecked, they are only shown when you hover over cells.)
   
  </div>
    {#each piece as page, i}
      <div class="pagenum">Page {i+1}:</div>
      <table class="page">
        <tbody>
          <tr>
            {#each page.timings as t}
              <th class="timing">{t}</th>
            {/each}
          </tr>
          {#each page.rows as r}
            <tr>
              {#each r as event}
                <td>{#if event}<Event {event} {showWords} />{/if}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}
  
<style>


  table {
      border-collapse: collapse;
      max-width: fit-content;
      margin: auto;
  }
  
  div, details {
    text-align: left;
  }

  th, td {
    border-left: 1px solid black;
    border-right: 1px solid black;
    width: 3em;
    max-height: 3em;
  }

  .pagenum {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
  }

  .explanation {
    text-align: left;
  }

  :global(body){
    margin: 1em;
  }


</style>