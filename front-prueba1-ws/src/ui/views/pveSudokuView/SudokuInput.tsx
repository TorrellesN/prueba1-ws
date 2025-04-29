import { useEffect } from "react";

type sudokuInputProps = {
    handleInputNumber: (number: number) => void,
    points: number,
    comboAcc: number
}

export default function SudokuInput({handleInputNumber, points, comboAcc}: sudokuInputProps) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          // Obtenemos el valor de la tecla presionada
          const key = event.key
          // Validamos que sea un número del 1 al 9
          if (/^[1-9]$/.test(key)) {
          console.log(Number(key));
            
            
            handleInputNumber(Number(key))
            console.log(`Número ingresado: ${key}`)
          }
        }
    
        window.addEventListener('keydown', handleKeyDown)
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown)
        }
      }, [])

    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-1 w-full max-w-xs sm:max-w-sm md:max-w-60">
                {numbers.map((number) => (
                    <button
                        key={number}
                        className={`aspect-[3/2] flex items-center justify-center rounded-lg border-2 
            
                       bg-gray-200 text-gray-700 text-lg font-bold border-gray-400
                         hover:bg-blue-300 hover:text-white transition-colors`}
                        onClick={() => handleInputNumber(number)}
                    >
                        {number}
                    </button>
                ))}
                <div>
                    <p>Puntos: {points}</p>
                    <p>Combo: {comboAcc}</p>
                </div>
            </div>
        </div>
    )
}
