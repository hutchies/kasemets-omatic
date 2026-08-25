// @ts-nocheck
import { hyphenated } from "hyphenated";

let morseVowels = {
    a: '.-',
    e: '.',
    i: '..',
    o: '---',
    u: '..-',
    w: '.--',
    y: '-.--'
}

export let dynamicValues = $state({
    b: 'p2',
    c: 'p',
    d: 'm',
    f: 'm',
    g: 'f',
    h: 'f2',
    j: '',
    k: 'p2',
    l: 'p',
    m: 'm',
    n: 'm',
    p: 'f',
    q: '',
    r: 'f4',
    s: 'p4',
    t: 'p2',
    v: 'm',
    x: '',
    z: 'f2'
})

export let timingThresholds = $state({
    'EXS': 0,
    'VS': 5,
    'S': 9,
    'M': 13,
    'F': 17,
    'VF': 21,
    'EXF': 25,
})

let vowel_list = Object.keys(morseVowels);


function convertEvent(s){
    let vowels = [];
    let morse = [];
    let repeats = s.length;
    let centre = s.toUpperCase()[0] == s[0];
    let t = s.toLowerCase();
    let nonVowels = [];
    let dynamics = [];
    for(let o of t.split('')){
        if(vowel_list.includes(o)){
            if(!vowels.includes(o)){
                vowels.push(o);
                morse.push({
                    text: o,
                    value: morseVowels[o]
                });
            }
        }else{
            nonVowels.push(o);
        }
    }
    for(let n of nonVowels){
        let value = dynamicValues[n] || 'f4';
        if(dynamics.length == 0 || dynamics.at(-1).value != value){
            dynamics.push({
                text: n,
                value
            })
        }
        
    }
    if(dynamics.length == 0){
        dynamics = [
            {
                text: '',
                value: 'f4'
            }
        ]
    }
    return {
        text: s,
        centre,
        morse,
        dynamics,
        ictus: morse.reduce((a,m) => a + m.value.length, 0),
        repeats
    }
}

export function analyseText(text){
    let pages = text.split('\n\n');
    let out = [];
    for(let p of pages){
        let lines = p.split(`\n`);
        let columns = [];
        let rows = [];
        for(let line of lines){
            let words = line.split(/\s+/);
            let events = [];
            for(let w of words){
                w = w.replaceAll(/[^A-Za-z ]+/g, ''); // punctuation etc.
                //let doc = nlp(w);
                console.log(w);
                let syllables = hyphenated(w).split(/\u00AD/);
                if(!syllables) continue;
                if(w.includes('_')){
                    syllables = w.split('_');
                }
                if(syllables.length == 0 || !w) continue;
                
                if(isVowel(syllables[0][0])){
                    // normalise it
                    syllables = [...normaliseVowels(syllables[0]), ...syllables.slice(1)]
                }
               
                for(let s of syllables){
                    if(!s) continue;
                    events.push(convertEvent(s));
                    
                }
            }
           rows.push(events);
        }
        // now work out column alignments
        let stats = rows.map(r => centreStats(r));
        let centrePos = Math.max(...stats.map(s => s.centre));
        let maxLength = centrePos + Math.max(...stats.map(s => s.after));
        console.log(rows, stats, centrePos, maxLength)
        let normalisedRows = [];
        for(let r of rows){
            let newRow = [];
            let s = stats.find(s => s.row == r);
            let toPad = centrePos - s.centre;
            for(let i = 0; i < toPad; i++){
                newRow.push(false);
            }
            newRow = [...newRow, ...r, ];
            let toPadEnd = maxLength - newRow.length;
            for(let i = 0; i < toPadEnd; i++){
                newRow.push(false);
            }
            normalisedRows.push(newRow);
        }
        
        let timings = [];
        for(let i = 0; i < normalisedRows[0].length; i++){
            let column = normalisedRows.map(r => r[i]);
            columns.push(column);
            timings.push(timingForColumn(column));
        }
        out.push({
            timings,
            rows: normalisedRows,
            columns
        });
    }
    return out;
}

function timingForColumn(col){
    let totalRepeats = col.filter(e => e).reduce((a, e) => a + e.repeats || 0, 0);
    let currentValue = 'tbc';
    for(let v of Object.values(timingThresholds)){
        if(totalRepeats >= parseInt(v)){
            currentValue = Object.keys(timingThresholds).find(key => timingThresholds[key] == v);
        }else{
            return currentValue;
        }
    }
}

function startsUpperCase(s){
    return s[0].toUpperCase() == s[0]
}

function centreStats(row){
    let c = row.findIndex(r => r.centre);
    if(c == -1) return {
        row,
        before: 0,
        centre: 0,
        after: 0
    }
    return {
        row,
        before: c,
        centre: c,
        after: row.length - (c)
    }
}

function isVowel(c){
    return ['a','e','i','o','u'].includes(c.toLowerCase());
}

function normaliseVowels(s){
    // specifically: 
    let firstNonVowel = s.split('').findIndex(c => !isVowel(c));
    if(firstNonVowel == -1) return [s];
    let hasVowelsAfter = s.slice(firstNonVowel).split('').find(c => isVowel(c));
    console.log(s, firstNonVowel, hasVowelsAfter)
    if(hasVowelsAfter){
        return [s.slice(0, firstNonVowel), s.slice(firstNonVowel)];
    }
    return [s];
}