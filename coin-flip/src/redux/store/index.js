import { createStore } from "redux";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";

import rootReducer from "../reducers";

const rootMiddleWare = applyMiddleware(thunk);
const store = createStore(rootReducer, rootMiddleWare);

export default store;
