import { createStore, applyMiddleware } from "redux";

// Logger with default options
import { logger } from "redux-logger";

import reducers from "./reducers";

export default function configureStore(initialState) {
  const store = createStore(reducers  , initialState, applyMiddleware(logger));
  return store;
}