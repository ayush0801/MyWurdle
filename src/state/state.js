import { List, Map } from "immutable";
import { isWordInWordList, solution } from "../lib/words";

export const LAST_PLAYING_CELL = 4;

export const winningWord_ = (word) =>
    new Map([...word].map((x, idx) => [x, idx]));

export const genInitialState = () => ['1', '2', '3', '4', '5', '6'].map(
    x => [
        x, List(
            [
                { state: 'Empty', character: '', flipped: false },
                { state: 'Empty', character: '', flipped: false },
                { state: 'Empty', character: '', flipped: false },
                { state: 'Empty', character: '', flipped: false },
                { state: 'Empty', character: '', flipped: false }
            ]
        )
    ]
);

export const gameState =
{
    cellCharacterMap: Map(genInitialState()),
    currentlyPlayingRow: '1',
    currentlyPlayingCell: 0,
    event: 'NoModal',
    animationsTrigger: [false, null],
    gameStatus: 'CurrentlyPlaying',
    winningWordMap: winningWord_(solution),
}


export const reduceCells = (currentlyPlayingRow, cellCharacterMap) =>
    cellCharacterMap.take(currentlyPlayingRow).reduce((acc, cells, _) =>
        acc.concat(cells.map(cell => {
            switch (cell.state) {
                case 'Empty':
                    return '';
                case 'Potential':
                    return '🟨';
                case 'Correct':
                    return '🟩';
                case 'Incorrect':
                    return '⬛';
                default:
                    return '';
            }
        }).join(''))
        , '');


export const gameReducer = (state, action) => {
    if (state.gameStatus === 'CurrentlyPlaying') {
        switch (action.type) {
            case 'ENTER':
                if (state.currentlyPlayingCell === 4) {
                    const cellsToUpdate = state.cellCharacterMap.get(state.currentlyPlayingRow.toString());

                    const res = { ...state };
                    if (isWordInWordList(cellsToUpdate.map(({ character }) => character).toArray().join(''))) {

                        res.cellCharacterMap = state.cellCharacterMap.withMutations(map => map.set(
                            state.currentlyPlayingRow.toString(),
                            cellsToUpdate.map(
                                ({ character }, index) =>
                                    (state.winningWordMap.has(character)) ?
                                        index === state.winningWordMap.get(character) ? ({ state: 'Correct', character, flipped: true }) : ({ state: 'Potential', character, flipped: true })
                                        : ({ state: 'Incorrect', character, flipped: true })
                            )
                        ));
                        res.animationsTrigger = [true, state.currentlyPlayingRow];
                        res.currentlyPlayingCell = 0;
                        res.currentlyPlayingRow = (parseInt(state.currentlyPlayingRow) + 1).toString();

                    } else {
                        res.event = 'WordNotFoundAlert';
                    }
                    if (cellsToUpdate.toArray().map(({ character }) => character).join('').toUpperCase() === solution) {
                        res.event = 'WinModal';
                        res.gameStatus = 'Won';
                    }
                    else if (state.currentlyPlayingRow === '6') {
                        res.event = 'GameLostAlert';
                        res.gameStatus = 'Lost';
                    }
                    return res;
                }
                else {
                    return {
                        ...state,
                        event: 'NotEnoughLettersAlert',
                    }
                }

            case 'DELETE':
                if (state.currentlyPlayingCell >= 0) {
                    const res = { ...state };
                    if (state.currentlyPlayingCell == LAST_PLAYING_CELL &&
                        state.cellCharacterMap.get(state.currentlyPlayingRow.toString()
                        ).get(state.currentlyPlayingCell).state == 'TBD') {
                        res.cellCharacterMap = state.cellCharacterMap.set(
                            state.currentlyPlayingRow.toString(),
                            state.cellCharacterMap.get(state.currentlyPlayingRow.toString())
                                .set(
                                    state.currentlyPlayingCell,
                                    {
                                        character: '',
                                        state: 'Empty'
                                    }
                                )
                        )
                    }
                    else {
                        res.cellCharacterMap = state.cellCharacterMap.set(
                            state.currentlyPlayingRow.toString(),
                            state.cellCharacterMap.get(state.currentlyPlayingRow.toString())
                                .set(
                                    state.currentlyPlayingCell - 1,
                                    {
                                        character: '',
                                        state: 'Empty'
                                    }
                                )
                        )
                        if (state.currentlyPlayingCell > 0) {
                            res.currentlyPlayingCell = state.currentlyPlayingCell - 1;
                        }
                    }
                    return res;
                }
                break;
            case 'CHAR':
                const res = { ...state };
                if (state.currentlyPlayingCell < 5) {
                    res.cellCharacterMap =
                        state.cellCharacterMap.withMutations(map => map.set(
                            state.currentlyPlayingRow.toString(),
                            map.get(state.currentlyPlayingRow.toString())
                                .set(state.currentlyPlayingCell,
                                    {
                                        character: action.value, state: 'TBD'
                                    }
                                )
                        ))

                    if (res.currentlyPlayingCell !== LAST_PLAYING_CELL)
                        res.currentlyPlayingCell = state.currentlyPlayingCell + 1;
                    return res;
                } else {
                    return res;
                }
            case 'WON':
                return { ...state, gameStatus: 'Won', event: 'WinModal' }
            case 'Event':
                return { ...state, event: action.value }
            case 'NoAnimation':
                return { ...state, animationsTrigger: [false, null] }
            default:
                return state;
        }
    }
    else if (state.gameStatus === 'Won') {
        switch (action.type) {
            case 'Event':
                return { ...state, event: action.value }
            default:
                return state;
        }
    }
    else {
        return state;
    }
}