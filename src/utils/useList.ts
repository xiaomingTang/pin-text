import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react"

type CompareFunction<T> = (firstItem: T, secondItem: T) => number;

interface ListActions<T> {
  set: Dispatch<SetStateAction<T[]>>;
  splice: (start: number, deleteCount: number, ...items: T[]) => void;
  push: (item: T) => void;
  pop: () => void;
  shift: () => void;
  unshift: (item: T) => void;
  sort: (compareFunction: CompareFunction<T>) => void;
  reverse: () => void;
}

export default function useList<T>(initialList: T[]): [T[], ListActions<T>] {
  const [list, set] = useState(initialList)

  const splice = useCallback((start: number, deleteCount: number, ...items: T[]) => {
    set((prev) => {
      const newList = [...prev]
      newList.splice(start, deleteCount, ...items)
      return newList
    })
  }, [])

  const push = useCallback((...items: T[]) => {
    set((prev) => ([...prev, ...items]))
  }, [])

  const pop = useCallback(() => {
    set((prev) => {
      const newList = [...prev]
      newList.pop()
      return newList
    })
  }, [])

  const shift = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(([firstItem, ...restItems]) => restItems)
  }, [])

  const unshift = useCallback((...items: T[]) => {
    set((prev) => ([...items, ...prev]))
  }, [])

  const sort = useCallback((compareFunction: CompareFunction<T>) => {
    set((prev) => {
      const newList = [...prev]
      newList.sort(compareFunction)
      return newList
    })
  }, [])

  const reverse = useCallback(() => {
    set((prev) => {
      const newList = [...prev]
      newList.reverse()
      return newList
    })
  }, [])

  const actions: ListActions<T> = useMemo(() => ({
    set,
    splice,
    push,
    pop,
    shift,
    unshift,
    sort,
    reverse,
  }), [pop, push, reverse, shift, sort, splice, unshift])

  return [list, actions]
}
