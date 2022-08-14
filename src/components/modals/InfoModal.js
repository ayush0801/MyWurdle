import { DialogTitle } from './DialogTitle';

export const InfoModal = () => (
    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
            <div className="text-center">
                <DialogTitle title="How to play" />
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Guess the WORDLE in 6 tries. After each guess, the color
                        of the tiles will change to show how close your guess was
                        to the word.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">
                    </div>
                    <p className="text-sm text-gray-500">
                        The letter W is in the word and in the correct spot.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">
                    </div>
                    <p className="text-sm text-gray-500">
                        The letter L is in the word but in the wrong spot.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">

                    </div>
                    <p className="text-sm text-gray-500">
                        The letter U is not in the word in any spot.
                    </p>
                </div>
            </div>
        </div>
    </div>
);