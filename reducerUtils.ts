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
