const Cigarette = () => {
  const audio = new Audio('/lighter.mp3')
  audio.play()
}

const SatisfyMySoul = () => {
  const audio = new Audio('/soul.mp3')
  audio.play()

  setTimeout(() => {
    audio.pause()
  }, 20000)
}

const WaitingInVain = () => {
  const audio = new Audio('/vain.mp3')
  audio.play()

  setTimeout(() => {
    audio.pause()
  }, 20000)
}

export { Cigarette, SatisfyMySoul, WaitingInVain }
