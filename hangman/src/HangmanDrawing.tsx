import { Hangmanword } from './HangmanWord';
const HEAD = (
    <div
        style={{
            width: "50px",
            height: "50px",
            borderRadius: "100%",
            border: "10px solid black",
            position: "absolute",
            top: "50px",
            right: "-30px"

        }}
    />
)
const BODY = (
    <div
        style={{
            width: "10px",
            height: "120px",
            position: "absolute",
            background: "black",
            top: "110px",
            right: 0

        }}
    />
)
const LEFT_ARM = (
    <div
        style={{
            width: "100px",
            height: "10px",
            position: "absolute",
            background: "black",
            top: "130px",
            right: "0",
            rotate: "30deg"

        }}
    />
)
const RIGHT_ARM = (
    <div
        style={{
            width: "100px",
            height: "10px",
            position: "absolute",
            background: "black",
            top: "130px",
            right: "-90px",
            rotate: "-30deg"

        }}
    />
)
const LEFT_LEG = (
    <div
        style={{
            width: "100px",
            height: "10px",
            position: "absolute",
            background: "black",
            top: "250px",
            right: "-10px",
            rotate: "-45deg"

        }}
    />
)
const RIGHT_LEG = (
    <div
        style={{
            width: "100px",
            height: "10px",
            position: "absolute",
            background: "black",
            top: "250px",
            right: "-80px",
            rotate: "45deg"

        }}
    />
)
const BODT_PART = [
    HEAD,
    BODY,
    RIGHT_ARM,
    LEFT_ARM,
    RIGHT_LEG,
    LEFT_LEG
]
type HangmanDrawingProps = {
    numberOfGuesses: number
}



export function HangmanDrawing({ numberOfGuesses }: HangmanDrawingProps) {
    return (
        <div style={{ position: "relative" }}>
            {BODT_PART.slice(0, numberOfGuesses)}
            <div
                style={{
                    height: "50px",
                    width: "10px",
                    background: "black",
                    position: "absolute",
                    top: 0,
                    right: 0
                }} />
            <div
                style={{
                    height: "10px",
                    width: "200px",
                    background: "black",
                    marginLeft: "120px",
                }} />
            <div
                style={{
                    height: "400px",
                    width: "10px",
                    background: "black",
                    marginLeft: "120px",
                }} />
            <div
                style={{
                    height: "10px",
                    width: "250px",
                    background: "black"
                }} />
            <div
                style={{

                }}
            />
        </div>
    )
}