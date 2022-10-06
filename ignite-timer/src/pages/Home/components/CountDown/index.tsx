/* eslint-disable no-undef */
import { differenceInSeconds } from 'date-fns'
import { useEffect } from 'react'
import { useCycle } from '../../../../context/useCycles'
import { CountdownContainer, Separator } from './style'

export function CountDown() {
  const {
    activeCycle,
    markCurrentCycleAsFinished,
    amountSecondPassed,
    amountSecondsPassed,
  } = useCycle()

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: NodeJS.Timer

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDiference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )
        if (secondsDiference >= totalSeconds) {
          markCurrentCycleAsFinished()
          amountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          amountSecondsPassed(secondsDiference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    amountSecondsPassed,
    markCurrentCycleAsFinished,
    totalSeconds,
  ])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes} : ${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
