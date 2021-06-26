[es-reduxed](README.md) / Exports

# es-reduxed

## Table of contents

### Type aliases

- [EventBase](modules.md#eventbase)
- [EventStoreProvider](modules.md#eventstoreprovider)
- [EventStoreSubscriber](modules.md#eventstoresubscriber)
- [EventsRepo](modules.md#eventsrepo)

### Functions

- [initialiseEventSourcingSystem](modules.md#initialiseeventsourcingsystem)

## Type aliases

### EventBase

Ƭ **EventBase**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | *number* |
| `payload` | *unknown* |
| `type` | *string* |
| `version` | *number* |

Defined in: index.ts:8

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

Defined in: index.ts:22

___

### EventStoreSubscriber

Ƭ **EventStoreSubscriber**: <T\>(`args`: *any*) => *Promise*<void\>

#### Type declaration

▸ <T\>(`args`: *any*): *Promise*<void\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [*EventBase*](modules.md#eventbase) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | *any* |

**Returns:** *Promise*<void\>

Defined in: index.ts:20

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
| `getEvents` | (`cursor?`: *number*, `limit?`: *number*) => *Promise*<T[]\> |
| `saveEvent` | (`event`: *Omit*<T, ``"id"``\>) => *Promise*<AppendEventResult<T\>\> |

Defined in: index.ts:15

## Functions

### initialiseEventSourcingSystem

▸ `Const` **initialiseEventSourcingSystem**<T\>(`__namedParameters`: *Props*<T\>): *Promise*<{ `meta`: { `replayDuration`: *number*  } ; `saveEvent`: (`event`: *Omit*<T, ``"id"``\>) => *Promise*<AppendEventResult<T\>\>  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [*EventBase*](modules.md#eventbase) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | *Props*<T\> |

**Returns:** *Promise*<{ `meta`: { `replayDuration`: *number*  } ; `saveEvent`: (`event`: *Omit*<T, ``"id"``\>) => *Promise*<AppendEventResult<T\>\>  }\>

Defined in: index.ts:34
