import { InformationCircleIcon } from '@heroicons/react/outline'
import { Alert } from './components/alerts/Alert'
import { solution } from './lib/words'
import View from './utils/View'
import { compose, last } from 'ramda'
import { head, maybe } from 'sanctuary'
import { concatComps } from './utils/concatComp';
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard';
import { gameState, gameReducer } from './state/state'
import { useReducer } from 'react'
import { ToastContainer } from 'react-toastify'
import { HOCModal } from './components/modals/HOCModal'
import { WinModal } from './components/modals/WinModal'
import { InfoModal } from './components/modals/InfoModal'


const daggy = require('daggy')

function App() {
  const [state, dispatch] = useReducer(gameReducer, gameState);
  const event = state.event;

  const updateClipboard = result => {
    navigator.clipboard.writeText(result).then(function () {
      dispatch({ type: 'Event', value: 'ShareCompleteAlert' });
      setTimeout(() => {
        dispatch({ type: 'Event', value: 'NoModal' })
      }, 2000);
    }, function () {
      /* clipboard write failed */
    });
  }

  const ModalV = daggy.taggedSum('Modal', {
    InfoModal: ['comp', 'props'],
    WinModal: ['comp', 'props'],
    NoModal: [],
  })

  const InfoModal_ = ModalV.InfoModal(HOCModal(InfoModal()), {
    isOpen: event === 'InfoModal',
    handleClose: () => dispatch({ type: 'Event', value: 'NoModal' }),
  })

  const WinModal_ = ModalV.WinModal(
    HOCModal(
      WinModal({
        handleShare: updateClipboard,
        state
      })
    ),
    {
      isOpen: event === 'WinModal',
      handleClose: () => dispatch({ type: 'Event', value: 'NoModal' }),
    }
  )

  const modalMapping = [
    [event === 'InfoModal', InfoModal_],
    [event === 'WinModal', WinModal_],
  ]

  const modalCataMorphism = (modal) =>
    modal.cata({
      InfoModal: (_) => toModalView(modal.comp, modal.props),
      WinModal: (_) => toModalView(modal.comp, modal.props),
      NoModal: () => null,
    })

  const handleModal = (a) =>
    maybe(View(() => <div>Nothing Modal!!</div>))(
      compose(modalCataMorphism, last)
    )(a)

  const AlertV = daggy.taggedSum('Alert', {
    WordNotFoundAlert: ['comp', 'props'],
    GameLostAlert: ['comp', 'props'],
    ShareCompleteAlert: ['comp', 'props'],
    NotEnoughLettersAlert: ['comp', 'props'],
  })
  const WordNotFoundAlert_ = AlertV.WordNotFoundAlert(Alert, {
    message: 'Word Not Found',
    isOpen: true,
  })
  const GameLostAlert_ = AlertV.GameLostAlert(Alert, {
    message: `You Lost, The Word Was ${solution}`,
    isOpen: true,
  })
  const ShareCompleteAlert_ = AlertV.ShareCompleteAlert(Alert, {
    message: 'Share Complete',
    variant: 'success',
    isOpen: true,
  })
  const NotEnoughLettersAlert_ = AlertV.NotEnoughLettersAlert(Alert, {
    message: 'Not Enough Letters',
    isOpen: true,
  })

  const alertMapping = [
    [event === 'WordNotFoundAlert', WordNotFoundAlert_],
    [event === 'GameLostAlert', GameLostAlert_],
    [event === 'ShareCompleteAlert', ShareCompleteAlert_],
    [event === 'NotEnoughLettersAlert', NotEnoughLettersAlert_],
  ]

  const alertCataMorphism = (alert) =>
    alert.cata({
      WordNotFoundAlert: (_) => toModalView(alert.comp, alert.props),
      GameLostAlert: (_) => toModalView(alert.comp, alert.props),
      ShareCompleteAlert: (_) => toModalView(alert.comp, alert.props),
      NotEnoughLettersAlert: (_) => toModalView(alert.comp, alert.props),
    })

  const handleAlert = (a) =>
    maybe(View(() => <div>Nothing Alert!!</div>))(
      compose(alertCataMorphism, last)
    )(a)

  const toModalView = (comp, props) => {
    return View(comp).contramap(() => props)
  }

  const InformationCircleIconView = View(InformationCircleIcon).contramap(
    () => ({
      className: 'text-white h-6 w-6 cursor-pointer',
      onClick: () => dispatch({ type: 'Event', value: 'InfoModal' }),
    })
  )

  return (
    <>
      <div className="dark:bg-black h-screen py-18 mx-auto sm:px-6 lg:px-8">
        <div>
          <ToastContainer
            position="top-center"
            theme='light'
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover />
          {concatComps([
            handleAlert(head(alertMapping.filter(([predicate, _]) => predicate))),
            handleModal(head(modalMapping.filter(([predicate, _]) => predicate))),
            View(() => (
              <div className="flex w-80 mx-auto items-center mb-8">
                <h1 className="text-6xl dark:text-white text-center font-my-font grow font-bold"> WORDLE</h1>
                {InformationCircleIconView.fold()}
              </div>
            )),
            View(Grid).contramap(() => ({ state })),
            View(Keyboard).contramap(() => ({ dispatch, state }))
          ]).fold()}</div>
      </div></>

  )
}

export default App
