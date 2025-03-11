import { useCallback,useEffect, useState } from 'react'
import words from "./wordList.json"
import { HangmanDrawing } from './HangmanDrawing'
import { Hangmanword } from './HangmanWord'
import { Keyboard } from './Keyboard'

function App() {
  const [wordToGuess,setWordToGuess] = useState(() =>{
    return words[Math.floor(Math.random()*words.length)]
  })

  const [guessedLetters,setGuessedLetters]=useState<string[]>([
   
  ])
  
  const incorrectLetters=guessedLetters.filter(
    letter=>!wordToGuess.includes(letter)
  )
  const addGuessedLetter=useCallback((letter:string)=>{
    if(guessedLetters.includes(letter)) return
    setGuessedLetters(currentLetters=>[...currentLetters,letter])
  },[guessedLetters]
  )
  

  useEffect(()=>{
    const handler=(e: KeyboardEvent)=>{
        const key=e.key
        if(!key.match(/^[a-z]$/)) return

        e.preventDefault()
        addGuessedLetter(key)
    }
    document.addEventListener("keypress",handler)
    return ()=>{
      document.removeEventListener("keypress",handler)
    }
  },[guessedLetters])
  return(<div
  style={{
   maxWidth:"800px",
   display:"flex",
   flexDirection:"column",
   gap:"2rem",
   margin:"auto",
   alignItems:"center"
  }}>
   <div style={{ fontSize:"2rem",textAlign:"center"}}>
     oombu
   </div>
   <HangmanDrawing numberOfGuesses={incorrectLetters.length}/>
   <Hangmanword guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
   <div style={{alignSelf:"stretch"
   }}>
    <Keyboard 
      activeLetters={guessedLetters.filter(letter=>
        wordToGuess.includes(letter)
      )}
      inactiveLetters={incorrectLetters}
      addGuessedLetters={addGuessedLetter}
    
    />
   </div>
   
  </div>)
}

export default App
