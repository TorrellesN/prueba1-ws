import { useContext, useState } from "react"
import { SocketContext } from "../utilities/context/socketContext"
import { Listbox } from "@headlessui/react"
import { useNavigate } from "react-router-dom"

export default function CreateSudokuView() {

    const navigate = useNavigate();
    
    const options = [
        { id: 1, name: 'Fácil' },
        { id: 2, name: 'Medio' },
        { id: 3, name: 'Difícil' },
      ]
    const [difSelected, setDifSelected] = useState<string>('');


  return (
    <>
    <h1 className="text-5xl font-black">Prueba</h1>
    <p className="text-2xl font-light text-gray-500 mt-5">
      Introduce tu nombre de usuario
    </p>

    

    <div className="my-5">

    <Listbox value={difSelected} onChange={(value) => setDifSelected(value)}>
      {({ open }) => (
        <div className="relative mt-3">
          <Listbox.Button className="block w-full appearance-none rounded-lg border-none bg-black/50 py-1.5 px-3 text-sm/6 text-white focus:outline-none">
          {difSelected || 'Selecciona una opción'}
          </Listbox.Button>
          {open && (
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              
              {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option.name}
                className={({ active }) =>
                  `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'} cursor-default select-none relative py-2 pl-10 pr-4`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                      {option.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}  

              {/* <ListboxOption value="canceled" className="cursor-pointer py-2 px-4 text-black hover:bg-gray-200">
                Canceled
              </ListboxOption> */}
            </Listbox.Options>
          )}
        </div>
      )}
      
    </Listbox>

      <button
        className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
        
        onClick = {() => navigate('/oneplayer/sudoku')}
      >
        Generar sudoku
      </button>
    </div>
    
        <p className="text-center py-20">No hay sudokus aún {''}
          
        </p>
       
      

    
  </>
  )
}
