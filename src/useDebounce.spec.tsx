import React, { useState } from "react"
import { useDebounce } from "./useDebounce"
import { createTimeout } from "@corets/promise-helpers"
import { act, render, screen } from "@testing-library/react"

describe("useDebounce", () => {
  it("debounces value", async () => {
    let renders = 0
    let _count
    let _setCount

    const Test = () => {
      renders++

      const [count, setCount] = useState(0)
      _count = count
      _setCount = setCount

      const debouncedCount = useDebounce(count, 30)

      return (
        <h1>
          {renders},{count},{debouncedCount}
        </h1>
      )
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("1,0,0")

    act(() => _setCount(1))

    expect(target).toHaveTextContent("2,1,0")

    await act(() => createTimeout(10))

    expect(target).toHaveTextContent("2,1,0")

    act(() => _setCount(2))

    expect(target).toHaveTextContent("3,2,0")

    await act(() => createTimeout(10))

    expect(target).toHaveTextContent("3,2,0")

    await act(() => createTimeout(30))

    expect(target).toHaveTextContent("4,2,2")
  })

  it("debounces function", async () => {
    let renders = 0
    let _increment

    const Test = () => {
      renders++

      const [count, setCount] = useState(0)
      _increment = useDebounce((x) => setCount(count + x), 30)

      return (
        <h1>
          {renders},{count}
        </h1>
      )
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("1,0")

    act(() => _increment(1))

    expect(target).toHaveTextContent("1,0")

    await act(() => createTimeout(20))

    expect(target).toHaveTextContent("1,0")

    act(() => _increment(3))

    expect(target).toHaveTextContent("1,0")

    await act(() => createTimeout(20))

    expect(target).toHaveTextContent("1,0")

    await act(() => createTimeout(30))

    expect(target).toHaveTextContent("2,3")

    act(() => _increment(2))

    expect(target).toHaveTextContent("2,3")

    await act(() => createTimeout(20))

    expect(target).toHaveTextContent("2,3")

    await act(() => createTimeout(30))

    expect(target).toHaveTextContent("3,5")
  })
})
