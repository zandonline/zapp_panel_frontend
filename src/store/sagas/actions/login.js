import { put } from 'redux-saga/effects'
import * as actionTypes from "../actionTypes";

export default function* login(action) {
  yield put({ type: actionTypes.login.login });
}
