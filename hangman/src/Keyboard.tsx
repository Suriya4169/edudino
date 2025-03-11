import styles from "./keyboard.module.css"; 
const KEYS = [
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "a", "s", "d", "f", "g", "h", "j", "k", "l",
    "z", "x", "c", "v", "b", "n", "m"
];

type KeyboardProps={
    activeLetters:string[]
    inactiveLetters:string[]
    addGuessedLetters:(letter:string)=> void
}
export function Keyboard({
    activeLetters,
    inactiveLetters,
    addGuessedLetters
}:KeyboardProps
) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))", // Fixed syntax
                gap: ".5rem",
            }}
        >
            {KEYS.map((key) => {
                const isActive = activeLetters.includes(key);
                const isInactive = inactiveLetters.includes(key);
                
                return (
                    <button 
                        onClick={() => addGuessedLetters(key)}
                        className={`${styles.btn} ${isActive ? styles.active : ""} ${isInactive ? styles.inactive : ""}`} 
                        key={key}
                        disabled={isInactive}
                    >
                        {key}
                    </button>
                );
            })}
        </div>
    );
}
