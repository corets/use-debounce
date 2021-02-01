export type UseDebounce = <TValue = any>(
  initialState: TValue,
  delay: number,
  options?: UseDebounceOptions
) => TValue

export type UseDebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}
