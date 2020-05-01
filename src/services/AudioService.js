
import key1 from 'assets/audio/key1.mp3'
import key2 from 'assets/audio/key2.mp3'
import key3 from 'assets/audio/key3.mp3'
import key4 from 'assets/audio/key4.mp3'
import key5 from 'assets/audio/key5.mp3'
import key6 from 'assets/audio/key6.mp3'
import key7 from 'assets/audio/key7.mp3'
import key8 from 'assets/audio/key8.mp3'

const songs = {
  key1,
  key2,
  key3,
  key4,
  key5,
  key6,
  key7,
  key8,
}

export default {
  play(song) {
    if (!songs[song]) {
      return
    }

    const player = document.createElement("audio")
    player.src = songs[song]
    player.play()
  }
}
