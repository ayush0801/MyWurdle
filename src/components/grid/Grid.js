import View from "../../utils/View"
import { concatComps } from '../../utils/concatComp';
import classNames from "classnames";
import { memo, useEffect, useRef, useState } from "react";
import { spring } from "react-flip-toolkit";
import ReactCardFlip from 'react-card-flip';

const Cell = memo(({ rowIndex, columnIndex, state_ }) => {
    const containerRef = useRef(null);
    const [doAnimationsTrigger_, rowIndexToAnimate] = state_.animationsTrigger;
    const { character, state } = state_.cellCharacterMap.get(rowIndex).toArray()[columnIndex];
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (state !== 'TBD' && state !== 'Empty') {
            if (doAnimationsTrigger_ && (rowIndex === rowIndexToAnimate.toString())) {
                setIsFlipped(!isFlipped);
            }
        }
    }, [])

    const classes = classNames(
        'square dark:text-white text-3xl w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded',
        {
            'bg-white dark:bg-slate-900 border-slate-200': !state,
            'bg-slate-400 text-white border-slate-400': state === 'Incorrect',
            'bg-green-500 text-white border-green-500': state === 'Correct',
            'bg-yellow-500 text-white border-yellow-500': state === 'Potential',
        }
    )

    return (
        <ReactCardFlip
            isFlipped={isFlipped}
            flipSpeedBackToFront={1.8}
            flipSpeedFrontToBack={1.8}
            flipDirection="vertical"
        >
            <div>
                <div ref={containerRef} className={classes}>{character}</div>
            </div>

            <div>
                <div ref={containerRef} className={classes}>{character}</div>
            </div>
        </ReactCardFlip>
    )
})

const RowView = ({ rowIndex, state }) =>
    View.of(
        concatComps(
            [0, 1, 2, 3, 4].map(
                columnIndex => View.of(<Cell state_={state} key={`${columnIndex}${rowIndex}`} rowIndex={rowIndex} columnIndex={columnIndex} />)
            )
        ).fold()
    ).map(
        cs => <div className="flex flex-row justify-center">{cs}</div>
    )


export const Grid = ({ state }) => {
    const containerRef = useRef(null);
    useEffect(() => {
        const squares = [...containerRef.current.querySelectorAll(".square")];
        squares.forEach((el, i) => {
            spring({
                config: "wobbly",
                values: {
                    translateY: [-15, 0],
                    opacity: [0, 1]
                },
                onUpdate: ({ translateY, opacity }) => {
                    el.style.opacity = opacity;
                    el.style.transform = `translateY(${translateY}px)`;
                },
                delay: i * 35,
            });
        });
    }, []);
    return (
        <div ref={containerRef}>{concatComps(
            ['1', '2', '3', '4', '5', '6'].map(rowIndex => RowView({ rowIndex, state })))
            .map(cs => <div key={Math.random()} className="pb-6">{cs}</div>).fold()}
        </div>)
}