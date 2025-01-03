declare module 'mitt' {
    export type EventType = string | symbol;
    export type Handler<T = any> = (event: T) => void;
    export type WildcardHandler = (type: EventType, event?: any) => void;
    export type EventHandlerList<T = any> = Array<Handler<T>>;
    export type WildCardEventHandlerList = Array<WildcardHandler>;
    export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<keyof Events | '*', EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList>;
  
    export interface Emitter<Events extends Record<EventType, unknown>> {
      all: EventHandlerMap<Events>;
  
      on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
      on(type: '*', handler: WildcardHandler): void;
  
      off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
      off(type: '*', handler: WildcardHandler): void;
  
      emit<Key extends keyof Events>(type: Key, event?: Events[Key]): void;
      emit(type: '*', event?: any): void;
  
      clear(): void;
    }
  
    export default function mitt<Events extends Record<EventType, unknown> = Record<EventType, unknown>>(
      all?: EventHandlerMap<Events>
    ): Emitter<Events>;
  }
  