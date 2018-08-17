import createNextState, { Draft } from 'immer';

export const createReducer = <S>(
  initialState: S,
  actionsMap: { [type: string]: (state: Draft<S>, payload: any) => void }
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
  actionsMap: { [type: string]: (state: Draft<S>, payload: any) => void }
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
  actionsFn: (draft: Draft<S>, action: A) => void | S
) => {
  return (state = initialState, action: A) => {
    return createNextState(state, draft => {
      return actionsFn(draft, action);
    });
  };
};
