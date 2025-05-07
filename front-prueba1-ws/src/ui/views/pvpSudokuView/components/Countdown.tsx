import React, { use, useEffect, useState } from 'react'
import { SudokuPVP } from '../../../../domain';

type CountdownProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sudokuId: SudokuPVP['id'];
}

export default function Countdown({ setIsLoading, sudokuId }: CountdownProps) {

    const onCountdown = () => {
        localStorage.setItem('sudokuRoomPvp', sudokuId!);
        setIsLoading(false);
    }

    const [countdown, setCountdown] = useState(4);

    const handleCountdown = () => {
        let count = countdown;
        const interval = setInterval(() => {
            if (count > 0) {
                setCountdown(count);
                count--;
            } else {
                clearInterval(interval);
                onCountdown();
            }
        }, 1000);
    }

    useEffect(() => {

        handleCountdown();
    }, [])

    return (
        <div>
            <h2 className='text-lg font-bold text-center'>Todos listos!</h2>
            <p>El sudoku va a comenzar en...</p>
            <div className='flex justify-center items-center'>
                <h1 className='text-8xl font-bold'>{(countdown > 0 && countdown < 4) ? countdown : ' '}</h1>
            </div>
        </div>
    )
}
