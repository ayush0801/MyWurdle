
import View from './View'
import { map, compose, adjust } from 'ramda';
import { Key } from '../components/keyboard/Key';

export const EnterKeyView = (onClick) => View(Key).contramap(() => ({
    width: 65.4,
    value: 'ENTER',
    children: <div>ENTER</div>,
    onClick,
}))

export const DeleteKeyView = (onClick) => View(Key).contramap(() => ({
    width: 65.4,
    value: 'DELETE',
    children: <div>DELETE</div>,
    onClick,
}));


export const KeyViews = (xs, onClick) => compose(
    map(
        keyview => View.of(keyview.fold()).map(
            kv => <div className="flex justify-center mb-1">{kv}</div>
        ))
    ,
    vs => adjust(2, v => EnterKeyView(onClick).concat(v.concat(DeleteKeyView(onClick))), vs),
    map(k => k.reduce((acc, curr) => acc.concat(curr))),
    map(
        map(k => View(Key).contramap(() => ({
            value: k,
            status: xs.get(k),
            onClick
        }))),
    ),
);


export const KeyViews_ = (charStatuses, onClick) => map(
    compose(
        k => k.reduce((acc, curr) => acc.concat(curr)),
        map(k => View(Key).contramap(() => ({
            value: k,
            status: charStatuses[k],
            onClick
        }))),

    ))
