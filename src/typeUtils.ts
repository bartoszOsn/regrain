import { Action } from "./action";
import { Grain } from "./grain";

export type DispatchFunc<TPayload> = <TPayload>(action: Action<TPayload>, payload: TPayload) => void;
export type GetFunc<TValue> = <TValue>(grain: Grain<TValue>) => TValue;
export type SetFunc<TValue> = <TValue>(grain: Grain<TValue>, value: TValue) => void;
