import React, { useState } from "react";
import styles from '../styles/Progress.module.css'

const Progress = ({totalSold, totalSupply}) => {
    const [percentage, setPercentage] = useState(parseInt((Number(totalSold)*100)/Number(totalSupply)));
    return (
        <div className={styles.progress_container}>
            <progress value={percentage} max={totalSupply} />
            <p>{percentage}% completado </p>
        </div>
    )
}

export default Progress;