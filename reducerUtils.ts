import createNextState from 'immer';

export const createReducer = <S>(
  initialState: S,
  actionsMap: { [type: string]: (state: S, payload: any) => void }
) => {
  return (state = initialState, { type, ...payload }: { type: string; payload: any }) => {
    const handler = actionsMap[type];
    if (handler) {
      return createNextState(state, draft => {
        return handler(draft, payload);
      });
    }
    return state;
  };
};

export const createReducerNew = <S>(
  initialState: S,
  actionsMap: { [type: string]: (state: S, payload: any) => void }
) => {
  return (state = initialState, { type, payload }: { type: string; payload: any }) => {
    const handler = actionsMap[type];
    if (handler) {
      return createNextState(state, draft => {
        return handler(draft, payload);
      });
    }
    return state;
  };
};

export const createReducerNext = <S, A extends { type: string }>(
  initialState: S,
  actionsFn: (draft: S, action: A) => void | S
) => {
  return (state = initialState, action: A) => {
    return createNextState(state, draft => {
      return actionsFn(draft, action);
    });
  };
};
