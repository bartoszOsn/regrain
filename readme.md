#Regrain
A simple state management library made for React.

##Main principles

- The store is made out of three types of elements:
  - Grain – It represents some single value.
  - Action – It is an action that store can be notified about.
  - Effect – It waits for specific action to be dispatched and then runs some code. This code can set a value of grain or dispach some other action. It also can be asynchronous.
- A store is a self–contained entity. The only place that it's value can be changed is inside an effect that belong to the same store. The only way a store communicates with outside code through values (from store to outside) and actions (from outside to store).
