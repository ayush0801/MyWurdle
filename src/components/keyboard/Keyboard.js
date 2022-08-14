import { useEffect, useLayoutEffect } from 'react'
import { KeyViews } from '../../utils/keyViews'
import { fromEvent, tap } from 'rxjs';
import { Map } from 'immutable';
import { useRef } from 'react';

export const Keyboard = ({ dispatch, state }) => {
  const cellCharacterMap = state.cellCharacterMap;
  const event = state.event;
  const currentlyPlayingRow_ = state.currentlyPlayingRow;
  const [doAnimationTrigger] = state.animationsTrigger;

  const dispatchRef = useRef(dispatch)
  useLayoutEffect(() => {
    dispatchRef.current = dispatch
  })

  useEffect(() => {
    if (doAnimationTrigger) {
      const NoAnimationTimeoutId = setTimeout(() => { dispatchRef.current({ type: 'NoAnimation' }) }, 1000);
      return () => clearTimeout(NoAnimationTimeoutId);
    }

  }, [doAnimationTrigger, event])

  useEffect(() => {
    if (event !== 'NoModal' && event !== 'WinModal' && event !== 'InfoModal') {
      const NoModalTimeoutId = setTimeout(() => { dispatchRef.current({ type: 'Event', value: 'NoModal' }) }, 2000);
      return () => clearTimeout(NoModalTimeoutId);
    }

  }, [doAnimationTrigger, event])

  const isValidKey = (key) => /^[A-Za-z]$/.test(key) && key.length === 1;

  const keyboardReducer = (e) => {
    const key = e.toUpperCase();
    switch (key) {
      case 'ENTER':
        dispatchRef.current({ type: 'ENTER' });
        break;
      case 'DELETE':
      case 'BACKSPACE':
        dispatchRef.current({ type: 'DELETE' });
        break;
      default:
        if (isValidKey(key))
          dispatchRef.current({ type: 'CHAR', value: key });
    }
  }

  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ]


  const keyMapSelector = Map(
    cellCharacterMap
      .toList()
      .take(currentlyPlayingRow_ - 1)
      .flatten()
      .groupBy((x) => x.character)
      .map((v) => (v.find((p) => p.state === "Correct") ? "Correct" : v.first().state)))

  useEffect(() => {
    fromEvent(document, 'keyup').pipe(tap(e => {
      keyboardReducer(e.key);

    })).subscribe();
  }, [])

  return (
    <div className="p-3" id="keyboard">
      {(
        KeyViews(keyMapSelector, (value) => keyboardReducer(value))(keys)
      )
        .reduce((acc, curr) => acc.concat(curr))
        .fold()}
    </div>
  )
}
