
import * as Tone from "tone"

const synth = new Tone.Synth().toMaster()
const polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster()
const beepSynth = new Tone.Synth({
  oscillator : {
    type : "pulse",
    modulationFrequency : 0.1
  },
  envelope : {
    attack : .1,
    decay : 0.1,
    sustain : 0.05,
    release : 0.1,
  }
}).toMaster()

const selectionTones = [
  'c3',
  'd3', 'g3', 'a3', 'a#3',
  'd4', 'f4', 'g4', 'a4', 'a#4',
  'd5', 'g5', 'a5', 'a#5',
  'd6', 'f6', 'g6', 'a6', 'a#6',
  'd7', 'g7', 'a7', 'a#7',
  'd8', 'f8', 'g8', 'a8', 'a#8'
]

export function playSelectionThumb(length) {
  length = Math.min(length - 1, selectionTones.length - 1)
  synth.triggerAttackRelease(selectionTones[length], '10n')
}

export function playClosedSelectionThumb(length) {
  length = Math.min(length - 1, selectionTones.length - 4)
  polySynth.triggerAttackRelease([selectionTones[length], selectionTones[length + 3]], '10n')
}

export function playNoMoreMoves() {
  beepSynth.triggerAttackRelease("a3", "20n");
  beepSynth.triggerAttackRelease("C2", "20n", '+0.25');
  beepSynth.triggerAttackRelease("f3", "20n", '+0.5');
}
