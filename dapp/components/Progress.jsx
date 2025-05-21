import React, { useState, useEffect } from "react";
import styles from '../styles/Progress.module.css'

const Progress = ({totalSold, totalSupply}) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // Asegurar que los valores sean números
        const sold = parseFloat(totalSold) || 0;
        const supply = parseFloat(totalSupply) || 0;
        
        // Calcular el porcentaje solo si hay un suministro total válido
        if (supply > 0) {
            const calculatedPercentage = (sold * 100) / supply;
            // Redondear a 2 decimales y asegurar que no exceda 100
            const roundedPercentage = Math.min(Math.round(calculatedPercentage * 100) / 100, 100);
            setPercentage(roundedPercentage);
            
            console.log('Progress calculation:', {
                sold,
                supply,
                calculatedPercentage,
                roundedPercentage
            });
        } else {
            setPercentage(0);
        }
    }, [totalSold, totalSupply]);

    return (
        <div className={styles.progress_container}>
            <progress value={percentage} max="100" />
            <p>{percentage.toFixed(2)}% completado</p>
        </div>
    )
}

export default Progress;