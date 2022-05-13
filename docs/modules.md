[es-reduxed](README.md) / Exports

# es-reduxed

## Table of contents

### Type aliases

- [EventBase](modules.md#eventbase)
- [EventStoreBase](modules.md#eventstorebase)
- [EventStoreProvider](modules.md#eventstoreprovider)
- [EventStoreSubscriber](modules.md#eventstoresubscriber)
- [EventsRepo](modules.md#eventsrepo)

### Functions

- [eventStoreReduxEnhancer](modules.md#eventstorereduxenhancer)
- [initialiseEventSourcingSystem](modules.md#initialiseeventsourcingsystem)

## Type aliases

### EventBase

Ƭ **EventBase**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | *number* |
| `payload?` | *unknown* |
| `type` | *string* |
| `version` | *number* |

Defined in: [index.ts:10](https://github.com/Antman261/es-reduxed/blob/fa0602b/src/index.ts#L10)

___

### EventStoreBase

Ƭ **EventStoreBase**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventStoreMetadata` | *object* |
| `eventStoreMetadata.lastEventId` | *number* |

Defined in: [index.ts:17](https://github.com/Antman261/es-reduxed/blob/fa0602b/src/index.ts#L17)

___

### EventStoreProvider

Ƭ **EventStoreProvider**<T\>: *object*

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [*EventBase*](modules.md#eventbase) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eventsRepo` | [*EventsRepo*](modules.md#eventsrepo)<T\> |
| `subscriber` | [*EventStoreSubscriber*](modules.md#eventstoresubscriber) |

Defined in: [index.ts:33](https://github.com/Antman261/es-reduxed/blob/fa0602b/src/index.ts#L33)

___

### EventStoreSubscriber

Ƭ **EventStoreSubscriber**: <S, E\>(`store`: *Store*<S, E\>) => *Promise*<void\>

#### Type declaration

▸ <S, E\>(`store`: *Store*<S, E\>): *Promise*<void\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | - |
| `E` | [*EventBase*](modules.md#eventbase) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | *Store*<S, E\> |

**Returns:** *Promise*<void\>

Defined in: [index.ts:29](https://github.com/Antman261/es-reduxed/blob/fa0602b/src/index.ts#L29)

___

### EventsRepo

Ƭ **EventsRepo**<T\>: *object*

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [*EventBase*](modules.md#eventbase) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getEventRange` | (`fromId`: *number*, `toId`: *number*) => *Promise*<T[]\> |
| `getEvents` | (`cursor?`: *number*, `limit?`: *number*) => *Promise*<T[]\> |
| `saveEvent` | (`event`: *Omit*<T, ``"id"``\>) => *Promise*<AppendEventResult<T\>\> |

Defined in: [index.ts:23](https://github.com/Antman261/es-reduxed/blob/fa0602b/src/index.ts#L23)

## Functions

### eventStoreReduxEnhancer

▸ `Const` **eventStoreReduxEnhancer**(`next`: *StoreEnhancerStoreCreator*<{}, {}\>): *StoreEnhancerStoreCreator*<any, [*EventStoreBase*](modules.md#eventstorebase)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `next` | *StoreEnhancerStoreCreator*<{}, {}\> |

**Returns:** *StoreEnhancerStoreCreator*<any, [*EventStoreBase*](modules.md#eventstorebase)\>

Defined in: [enhancer.ts:10](https://github.com/Antman261/es-reduxed/blob/fa0602b/src/enhancer.ts#L10)

___

### initialiseEventSourcingSystem

▸ `Const` **initialiseEventSourcingSystem**<S, E\>(`__namedParameters`: *Props*<S, E\>): *Promise*<{ `meta`: { `replayDuration`: *number*  } ; `raiseEvent`: (`event`: *Omit*<E, ``"id"``\>) => *Promise*<S\>  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | [*EventStoreBase*](modules.md#eventstorebase) |
| `E` | [*EventBase*](modules.md#eventbase) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | *Props*<S, E\> |

**Returns:** *Promise*<{ `meta`: { `replayDuration`: *number*  } ; `raiseEvent`: (`event`: *Omit*<E, ``"id"``\>) => *Promise*<S\>  }\>

Defined in: [initialisation.ts:65](https://github.com/Antman261/es-reduxed/blob/fa0602b/src/initialisation.ts#L65)
