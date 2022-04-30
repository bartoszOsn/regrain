import { createContext } from "react";
import { Store } from "../store/Store";

export const storeContext = createContext<Store>(undefined as unknown as Store); // TODO better typing
