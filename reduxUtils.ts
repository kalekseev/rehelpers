import { Action } from 'redux';

type FunctionType = (...args: any[]) => any;
interface ActionCreatorsMapObject { [actionCreator: string]: FunctionType }
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>
interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P
}
interface ActionWithPayloadMeta<T extends string, P, M> extends Action<T> {
  payload: P,
  meta: M,
}
export function createAction<T extends string>(type: T): Action<T>
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>
export function createAction<T extends string, P, M>(type: T, payload: P, meta: M): ActionWithPayloadMeta<T, P, M>
export function createAction<T extends string, P, M>(type: T, payload?: P, meta?: M) {
  if (payload === undefined && meta === undefined) {
    return {type};
  } else if (payload && meta === undefined) {
    return { type, payload }
  } else if (meta && payload === undefined) {
    return { type, meta }
  } else {
    return { type, payload, meta }
  }
}
