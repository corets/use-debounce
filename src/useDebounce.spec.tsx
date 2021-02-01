import React, { useState } from "react"
import { useDebounce } from "./useDebounce"
import { mount } from "enzyme"
import { act } from "react-dom/test-utils"
import { createTimeout } from "@corets/promise-helpers"

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
        <div>
          {renders},{count},{debouncedCount}
        </div>
      )
    }

    const wrapper = mount(<Test />)
    const targetText = () => wrapper.find("div").text()

    expect(targetText()).toBe("1,0,0")

    act(() => _setCount(1))

    expect(targetText()).toBe("2,1,0")

    await act(() => createTimeout(10))

    expect(targetText()).toBe("2,1,0")

    act(() => _setCount(2))

    expect(targetText()).toBe("3,2,0")

    await act(() => createTimeout(10))

    expect(targetText()).toBe("3,2,0")

    await act(() => createTimeout(30))

    expect(targetText()).toBe("4,2,2")
  })

  it("debounces function", async () => {
    let renders = 0
    let _increment

    const Test = () => {
      renders++

      const [count, setCount] = useState(0)
      _increment = useDebounce((x) => setCount(count + x), 30)

      return (
        <div>
          {renders},{count}
        </div>
      )
    }

    const wrapper = mount(<Test />)
    const targetText = () => wrapper.find("div").text()

    expect(targetText()).toBe("1,0")

    act(() => _increment(1))

    expect(targetText()).toBe("1,0")

    await act(() => createTimeout(20))

    expect(targetText()).toBe("1,0")

    act(() => _increment(3))

    expect(targetText()).toBe("1,0")

    await act(() => createTimeout(20))

    expect(targetText()).toBe("1,0")

    await act(() => createTimeout(30))

    expect(targetText()).toBe("2,3")

    act(() => _increment(2))

    expect(targetText()).toBe("2,3")

    await act(() => createTimeout(20))

    expect(targetText()).toBe("2,3")

    await act(() => createTimeout(30))

    expect(targetText()).toBe("3,5")
  })
})
