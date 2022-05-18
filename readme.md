# Regrain
A simple state management library made for React.

## Main principles

- The store is made out of three types of elements:
  - Grain – It represents some single value.
  - Action – It is an action that store can be notified about.
  - Effect – It waits for specific action to be dispatched and then runs some code. This code can set a value of grain or dispatch some other action. It also can be asynchronous.
- A store is a self–contained entity. The only place that it's value can be changed is inside an effect that belong to the same store. The only way a store communicates with outside code through values (from store to outside) and actions (from outside to store).

## Quick start

Here's an example of simple store that fetches some data from backend API when needed and then stores it:

```typescript
import { createGrain } from "./grain";
import { createAction } from "./action";
import { createSimpleEffect } from "./effect";

// Grains - these are the variables that represents single values
const backendData = createGrain('backend data', null);
const backendDataPending = createGrain('backend data pending', false);
const backendDataError = createGrain('backend data error', null);

// Actions
const backendDataNeededAction = createAction('backend data needed');

// Effects
const backendDataNeededEffect = createSimpleEffect(backendDataNeededAction, async (props) => {
  // If data isn't already downloaded
  if (!props.get(backendData)) {
	// we set a backendDataPending to true, notifying that data is being fetched
	props.set(backendDataPending, true);
	try {
	  // we try do download data...
	  const data = await fetch('/backend-data').then(data => data.json());

	  // ... and then store that value
	  props.set(backendData, data);
	} catch (error) {
	  props.set(backendDataError, error);
	}

	// We ended fetching now, so we can set pending to false
	props.set(backendDataPending, false);
  }
});
```

Now, when we have our building blocks of the store created, we can take care of the store itself.

```typescript
import { createStoreProvider } from "./createStoreProvider";

const StoreProvider = createStoreProvider({
grains: [backendData, backendDataError, backendDataPending],
actions: [backendDataNeededAction],
effects: [backendDataNeededEffect]
});
```

What we are creating is a store provider. You can treat it like a simple context provider. It must be a parent of any component that needs to use this store.

```typescript jsx
import { useGrain } from "./useGrain";
import { useDispatch } from "./useDispatch";
import { useEffect } from "react";

function App() {
  return (
		  <StoreProvider>
			<Main/>
		  </StoreProvider>
  )
}

function Main() {
  // We can get store values by using a `useGrain` hook
  const data = useGrain(backendData);
  const pending = useGrain(backendDataPending);
  const error = useGrain(backendDataError);

  // We can also dispatch action - and invoke effects this way - using a function
  // returned by a `useDispatch` hook.
  const dispatch = useDispatch();

  // at the beginning of components "life" we notify store
  // that we are going to need backend data
  useEffect(() => {
	  // Notice, that we could dispatch this action multiple times,
	  // but store will fetch it only once, because we expect
	  // that the data will be the same every time.

	  // Store is the boss of the data, and no component will be telling him
	  // how to do his job!
	  dispatch(backendDataNeededAction());
  }, []);
  
  return (
	  <div>
		{ pending && 'Loading...' }
		{ (error && !pending) && 'Error!' }
		{ !error && !pending && <DataPresenter data={data} /> }
	  </div>
  )
}
```
