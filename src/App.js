import React, {useState , useEffect} from 'react'
import blank from './Assets/blank.png'
import blue from './Assets/blue-candy.png'
import green from './Assets/green-candy.png'
import orange from './Assets/orange-candy.png'
import purple from './Assets/purple-candy.png'
import red from './Assets/red-candy.png'
import yellow from './Assets/yellow-candy.png'
import Score from './Components/Score'

function App() {
  const [randomColorArray, setrandomColorArray] = useState([])
  const [squareDragged, setsquareDragged] = useState()
  const [squareReplaced, setsquareReplaced] = useState()
  const [score, setscore] = useState(0)

  const w=8
  const candyColors=[
    blue,
    green,
    orange,
    purple,
    red,
    yellow
  ]

  const checkForColumnOfThree=()=>{
    for(let i=0;i<=47;i++){
      let columnOfThree=[i, i+w, i+(w*2)]
      const color=randomColorArray[i]
      const isBlank= randomColorArray[i]===blank
      if(columnOfThree.every(square=> randomColorArray[square]===color && !isBlank)){
        setscore((score)=> score+3)
      columnOfThree.forEach(square=> randomColorArray[square]=blank)
       return true
    }
    }
    
  }
  const checkForRowOfThree=()=>{
    for(let i=0;i<=63;i++){
      let RowOfThree=[i, i+1, i+2]
      const color=randomColorArray[i]
      const isBlank= randomColorArray[i]===blank
      const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]
      if(notValid.includes(i)){
        continue
      }

      if(RowOfThree.every(square=> randomColorArray[square]===color && !isBlank)){
        setscore((score)=> score+3)
      RowOfThree.forEach(square=> randomColorArray[square]=blank)
      return true}
    }
    
  }
  const checkForColumnOfFour=()=>{
    for(let i=0;i<=39;i++){
      let columnOfFour=[i, i+w, i+(w*2), i+(w*3)]
      const color=randomColorArray[i]
      const isBlank= randomColorArray[i]===blank
      if(columnOfFour.every(square=> randomColorArray[square]===color && !isBlank)){
        setscore((score)=> score+4)
      columnOfFour.forEach(square=> randomColorArray[square]=blank)
      return true}
    }
    
  }
  const checkForRowOfFour=()=>{
    for(let i=0;i<=63;i++){
      let RowOfFour=[i, i+1, i+2, i+3]
      const color=randomColorArray[i]
      const isBlank= randomColorArray[i]===blank
      const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63,5,13,21,29,37,45,53,61]
      if(notValid.includes(i)){
        continue
      }
      if(RowOfFour.every(square=> randomColorArray[square]===color && !isBlank)){
        setscore((score)=> score+4)
      RowOfFour.forEach(square=> randomColorArray[square]=blank)
      return true}
    }
  }

  const movingDown=()=>{
    for(let i=0;i<56;i++){
      const firstRow=[0,1,2,3,4,5,6,7]
      if(firstRow.includes(i) && randomColorArray[i]===blank){
        randomColorArray[i]=candyColors[Math.floor(Math.random()*candyColors.length)]
      }

      if(randomColorArray[i+w]==blank){
        randomColorArray[i+w]=randomColorArray[i]
        randomColorArray[i]=blank
      }
    }
  }

  const dragStart=(e)=>{
    setsquareDragged(e.target)
  }
  const dragDrop=(e)=>{
    setsquareReplaced(e.target)

  }
  const dragEnd=()=>{
      const squareDraggedId=parseInt(squareDragged.getAttribute('data-id'))
      const squareReplacedId=parseInt(squareReplaced.getAttribute('data-id'))
      randomColorArray[squareReplacedId]=squareDragged.getAttribute('src')
      randomColorArray[squareDraggedId]=squareReplaced.getAttribute('src')

      const isValid=[squareDraggedId-1,squareDraggedId+1,squareDraggedId-w,squareDraggedId+w]

      const validMove=isValid.includes(squareReplacedId)

      const isC4=checkForColumnOfFour()
      const isR4=checkForRowOfFour()
      const isC3=checkForColumnOfThree()
      const isR3=checkForRowOfThree()

      if(squareReplacedId && validMove && (isC4 || isR4 || isC3 || isR3)){
        setsquareDragged(null)
        setsquareReplaced(null)
      }
      else{
        randomColorArray[squareReplacedId]=squareReplaced.getAttribute('src')
        randomColorArray[squareDraggedId]=squareDragged.getAttribute('src')
        setrandomColorArray([...randomColorArray])
      }
  }

  const createBoard= ()=>{

    const randomColor=[]
    for(let i=0;i<w*w;i++){
    const boardColor= candyColors[Math.floor(Math.random()* candyColors.length)]
    randomColor.push(boardColor)
    }
    setrandomColorArray(randomColor)
  }

    useEffect(() => {
      createBoard();
    }, [])

    useEffect(() => {
      const timer= setInterval(()=>{
        checkForColumnOfFour();
        checkForRowOfFour();
        checkForColumnOfThree();
        checkForRowOfThree();
        movingDown();
        setrandomColorArray([...randomColorArray])
      }, 100)
    
      return () => {
        clearInterval(timer)
      }
    }, [checkForColumnOfFour,checkForColumnOfThree,checkForRowOfFour, checkForRowOfThree ,movingDown, randomColorArray])
    

  return (
    <>
    <div className='ScoreBoard'>
      <Score scorep={score} />
    </div>
      <div className="app">
        <div className="game">
          {randomColorArray.map((boxColor,index)=>{
            return <img 
            key={index}
            src={boxColor}
            alt={boxColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e)=> e.preventDefault()}
            onDragEnter={(e)=> e.preventDefault()}
            onDragLeave={(e)=> e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            />
          })}
        </div>
      </div>
    </>
  );
}

export default App;
