import { CheckIcon } from '@heroicons/react/outline';
import { DialogTitle } from './DialogTitle';

const reduceCells = (currentlyPlayingRow, cellCharacterMap) =>
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


export const WinModal = ({ handleShare, state }) => {
    const cellState = state.cellCharacterMap;
    const currentlyPlayingRow = state.currentlyPlayingRow;
    const cellString_ = `Wordle ${reduceCells(currentlyPlayingRow, cellState)}`;

    return (
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
            <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                    />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                        title="You won!"
                    />
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">Great job.</p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6">
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => {
                        handleShare(cellString_)
                    }}
                >
                    Share
                </button>
            </div>
        </div>
    )
}