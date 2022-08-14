import { WORDS } from '../constants/wordlist'
import { VALIDGUESSES } from '../constants/validGuesses'

export const isWordInWordList = (word) => {
  return (
    WORDS.includes(word.toLowerCase()) ||
    VALIDGUESSES.includes(word.toLowerCase())
  )
}

export const isWinningWord = (word) => {
  return solution === word
}

export const getWordOfDay = () => {
  const epochMs = 1641013200000
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay)
  const result = {
    solution: WORDS[index].toUpperCase(),
    solutionIndex: index,
  };
  return result;
}

export const { solution, solutionIndex } = getWordOfDay()
