export interface State {
  id: string;
  name: string;
}

export const initState: State = {
  id: "103877772",
  name: "王小明",
}

export type Action = {
  type: "@user/init";
  value: State;
}

export function reducer(state = initState, action: Action): State {
  switch (action.type) {
  case "@user/init": {
    return {
      ...state,
      ...action.value,
    }
  }
  default:
    // @ts-ignore
    if (/^@user/g.test(action.type)) {
      const neverAction: never = action.type
      console.error("wrong action: ", neverAction)
    }
    return state
  }
}
