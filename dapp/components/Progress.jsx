import React, { useState } from "react";
import styles from '../styles/Progress.module.css'

const Progress = ({totalSold, totalSupply}) => {
    const [percentage, setPercentage] = useState(parseInt((totalSold*BigInt(100))/totalSupply));
    return (
        <div className={styles.progress_container}>
            <progress value={percentage} max={totalSupply} />
            <p>{percentage}% completado </p>
        </div>
    )
}

export default Progress;