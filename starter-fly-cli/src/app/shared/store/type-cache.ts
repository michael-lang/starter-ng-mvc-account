import { Action } from '@ngrx/store';

/**
* This function coerces a string into a string literal type.
* Using tagged union types in TypeScript 2.0, this enables
* powerful typechecking of our reducers.
*
* Since every action label passes through this function it
* is a good place to ensure all of our action labels
* are unique.
*/
const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
 if (typeCache[<string>label]) {
   throw new Error(`Action type "${label}" is not unique"`);
 }

 typeCache[<string>label] = true;

 return <T>label;
}

//TODO rename this, ngrx stole it
export interface ActionReducerMap<T, ActionType extends Action> {
 (state: T, action: ActionType): T;
 handlesType(action: Action): action is ActionType;
}

/**
* This function builds a state reducer to replace the typical switch/case pattern,
* given an initial state and a list of classes with static type and reduce function.
* @param initial The initial state for this reducer, called by store to initialize the state
* @param actionClasses a list of classes (type names) implementing the required static reducer interface.
*/
export function buildReducer<T>( //TODO 2.3 could handle this as a default generic
 initial: T,
 ...actionClasses: { type: string, reduce: (state: T, action: Action) => T }[]
): ActionReducerMap<T, Action> {
   return buildActionsReducer<T, Action>(initial, ...actionClasses);
}

/**
* This function builds a state reducer to replace the typical switch/case pattern,
* given an initial state and a list of classes with static type and reduce function.
* @param initial The initial state for this reducer, called by store to initialize the state
* @param actionClasses a list of classes (type names) implementing the required static reducer interface.
*/
export function buildActionsReducer<T, ActionType extends Action>(
 initial: T,
 ...actionClasses: { type: string, reduce: (state: T, action: ActionType) => T }[]
): ActionReducerMap<T, ActionType> {
 const handlers: {
   [key: string]: (state: T, action: ActionType) => T
 } = {};
 actionClasses.forEach((ac) => {
   handlers[ac.type] = ac.reduce;
 });

 //TODO is there a type safe way to do this?
 const reducer = (state: T = initial, action: ActionType) => handlers[action.type] ? handlers[action.type](state, action) : state;
 (reducer as any).handlesType = (action: ActionType) => !!handlers[action.type];
 return reducer as ActionReducerMap<T, ActionType>;
}
