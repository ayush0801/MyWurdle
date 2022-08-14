import classnames from 'classnames'

export const Key = ({
  children,
  width = 40,
  value,
  status,
  onClick,
}) => {
  const classes = classnames(
    'flex dark:text-white text-md items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer',
    {
      'bg-slate-800  hover:bg-slate-600 active:bg-slate-600': 'TBD',
      'dark:bg-slate-400 text-white': status === 'Incorrect',
      'dark:bg-green-500 hover:bg-green-600 active:bg-green-700 text-white':
        status === 'Correct',
      'dark:bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white':
        status === 'Potential',
    }
  )

  return (
    <div
      style={{ width: `${width}px`, height: '58px' }}
      className={classes.concat()}
      onClick={() => onClick(value)}
    >
      {children || value}
    </div>
  )
}
