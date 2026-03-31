'use client'

import { useEffect, useState } from 'react'

// June 24, 2009 22:30:00 TRT (Turkey Time = UTC+3) = 19:30:00 UTC
const BIRTH = Date.UTC(2009, 5, 24, 19, 30, 0)

function preciseAge(now: number): string {
  const birth = new Date(BIRTH)
  const current = new Date(now)

  let years = current.getUTCFullYear() - birth.getUTCFullYear()
  let monthDay = new Date(Date.UTC(current.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate(), birth.getUTCHours(), birth.getUTCMinutes()))

  if (current.getTime() < monthDay.getTime()) {
    years--
    monthDay = new Date(Date.UTC(current.getUTCFullYear() - 1, birth.getUTCMonth(), birth.getUTCDate(), birth.getUTCHours(), birth.getUTCMinutes()))
  }

  const nextBirthday = new Date(Date.UTC(current.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate(), birth.getUTCHours(), birth.getUTCMinutes()))
  if (current.getTime() < nextBirthday.getTime()) {
    const prevBirthday = new Date(Date.UTC(current.getUTCFullYear() - 1, birth.getUTCMonth(), birth.getUTCDate(), birth.getUTCHours(), birth.getUTCMinutes()))
    const yearLength = nextBirthday.getTime() - prevBirthday.getTime()
    const elapsed = current.getTime() - prevBirthday.getTime()
    return (years + elapsed / yearLength).toFixed(9)
  } else {
    const nextNext = new Date(Date.UTC(current.getUTCFullYear() + 1, birth.getUTCMonth(), birth.getUTCDate(), birth.getUTCHours(), birth.getUTCMinutes()))
    const yearLength = nextNext.getTime() - nextBirthday.getTime()
    const elapsed = current.getTime() - nextBirthday.getTime()
    return (years + elapsed / yearLength).toFixed(9)
  }
}

export default function AgeCounter() {
  const [age, setAge] = useState<string | null>(null)

  useEffect(() => {
    setAge(preciseAge(Date.now()))
    const id = setInterval(() => setAge(preciseAge(Date.now())), 50)
    return () => clearInterval(id)
  }, [])

  return <span className="tabular-nums">{age ?? '16'}</span>
}
