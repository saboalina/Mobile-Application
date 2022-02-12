import {combineReducers } from "redux";
import connectivityReducer from "./connectivityReducer";
import elementsReducer from "./elementsReducer"

export const rootReducer = combineReducers({elements: elementsReducer, connectivity: connectivityReducer})
