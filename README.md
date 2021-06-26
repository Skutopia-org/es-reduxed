# ES Reduxed[![npm monthly downloads](https://img.shields.io/npm/dm/es-reduxed.svg?style=flat-square)](https://www.npmjs.com/package/es-reduxed) [![current version](https://img.shields.io/npm/v/es-reduxed.svg?style=flat-square)](https://www.npmjs.com/package/es-reduxed) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


ES Reduxed offers an easy way to build an event-sourced backend using the redux pattern most javascript developers are familiar with!

Comes with a Postgres backed event store, with more event store providers coming.

## Installation

Run `npm i es-reduxed` to save to your dev dependencies.

## Usage

To get started we:
1. Create an event store provider
2. initialise our event store with the given provider, and a redux "store"

In the following example we use the postgres provider included in this package:

```typescript
import { initialiseEventSourcingSystem } from 'es-reduxed';
import { createPostresEventStoreProvider } from 'es-reduxed/postgres';
import { poolConfig } from '../db/connection';
import { reduxStore } from '../store';
import * as express from 'express';

const initialiseServer = async () => {
  const PORT = 8080;
  const app = express();

  const provider = createPostresEventStoreProvider({
    eventSchema: 'core_domain',
    poolConfig,
  });

  await initialiseEventSourcingSystem({
    reduxStore,
    eventStoreProvider: provider,
  });

  app.get('/count', (res, req) => {
    const { count } = reduxStore.getState();
    res.json({ count });
  });
  
  app.post('/count', (res, req) => {
    provider.saveEvent({ type: 'COUNTED' });
    res.sendStatus(200);
  })

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  return app;
};

initialiseServer();

```

Now your redux state is coupled to the event store. Whenever you save an event, your redux state will update once it has received the event from the subscriber.