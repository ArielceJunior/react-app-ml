import { useState } from 'react'
import './App.css'

function Counter({title}) {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <div className="card">
        <h2>Jogador: {title} </h2>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

      </div>

    </>
  )
}

export default Counter
