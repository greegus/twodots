
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

const goalSynth = new Tone.Synth({
  oscillator : {
    type : "sine",
  },
  envelope : {
    attack : .1,
    decay : 0.2,
    sustain : 0,
    release : 1.2,
  }
}).toMaster()

const clickSynth = new Tone.Synth({
  oscillator: {
    type: 'sine',
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0,
    decay: 0.1,
    sustain: 0,
    release: 0.1,
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

// a h c d e f g a

export function playSelectionThumb(length, enclosed = false) {
  length = Math.min(length - 1, selectionTones.length - 1)

  if (enclosed) {
    polySynth.triggerAttackRelease([selectionTones[length], selectionTones[length + 3]], '10n')
  } else {
    synth.triggerAttackRelease(selectionTones[length], '10n')
  }
}

export function playNoMoreMovesThumb() {
  beepSynth.triggerAttackRelease('a3', '20n')
  beepSynth.triggerAttackRelease('c2', '20n', '+0.25')
  beepSynth.triggerAttackRelease('f3', '20n', '+0.5')
}

export function playGoalReachedThumb() {
  goalSynth.triggerAttackRelease('a3')
  goalSynth.triggerAttackRelease('g5', '12n', '+.15')
}

export function playVictoryThumb() {
  goalSynth.triggerAttackRelease('d3')
  goalSynth.triggerAttackRelease('c6', '20n', '+.15')
}

export function playClick() {
  clickSynth.triggerAttackRelease(600, '1n')
}
