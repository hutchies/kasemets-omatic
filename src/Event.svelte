<script>
    let {event, showWords} = $props();
    let hover = $state(false);
</script>

<div class="event" on:pointerenter={e => hover = true} on:pointerleave={e => hover = false}>
    <div class="dynamics" class:only={event.dynamics.length == 1}>
        {#each event.dynamics as d}
            <span>{@html d.value.replaceAll(/(\d+)/g, `<sup>$1</sup>`)}<sup><!-- just so spacing is identical--></sup></span>
        {/each}
    </div>
    <div class="morse" style="line-height: {1 / event.morse.length};">
        {#each event.morse as m}
            <span>{m.value}</span>
        {/each}
    </div>
    <div class="repeats only">
        {event.repeats}
    </div>
    {#if hover || showWords}
        <div class="word">
            {event.text}
        </div>
    {/if}
</div>


<style>

.event > div {
    display: flex;
    flex-wrap: nowrap;
    text-align: center; 
    pointer-events: none;
}

.event {
    width: 3em;
    height: 3em;
    position: relative;
    
}


.dynamics {
    font-size: 0.7em;
    font-style: italic;
    position: absolute;
    top: 0;
    left: 10%;
    width: 90%;
    height: 10%;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
}

.morse {
    position: absolute;
    font-weight: bold;
    top: 25%;
    left: 10%;
    width: 90%;
    height: 60%;
    flex-direction: column;
    align-items: center;
    line-height: 0.5em;
    justify-content: center;
}

.repeats {
    font-size: 0.7em;
    font-style: italic;
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 15%;
    align-items: center;
    
}
.only {
    justify-content: center;
}

.word {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    opacity: 40%;
    color: blue;
    z-index: -5;
}
</style>