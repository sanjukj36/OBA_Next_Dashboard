'use client'

import { useState, useEffect } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { useDebounce } from 'react-use'

export function useDebouncedQueryState(
  key: string,
  delay = 300
): [string, (value: string) => void] {
  const [rawValue, setRawValue] = useQueryState(
    key,
    parseAsString.withDefault('')
  )

  const [localValue, setLocalValue] = useState(rawValue)

  useEffect(() => {
    setLocalValue(rawValue)
  }, [rawValue])

  useDebounce(
    () => {
      setRawValue(localValue || null)
    },
    delay,
    [localValue]
  )

  return [localValue, setLocalValue]
}

