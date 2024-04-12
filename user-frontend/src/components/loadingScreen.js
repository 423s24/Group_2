import React from "react";
import { motion } from "framer-motion";

const containerStyle = {
    width: "100%",
    height: "100%"
};

const circleStyle = {
    width: "3rem",
    height: "3rem",
    border: "0.5rem solid #e9e9e9",
    borderTop: "0.5rem solid #3498db",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    boxSizing: "border-box",
}

const spinTransition = {
    repeat: Infinity, // Loop forever
    repeatType: "loop",
    duration: 1,
    ease: "linear"
}

export default function LoaderScreen () {
    return (
        <div style={containerStyle}>
            <motion.span
                style={circleStyle}
                animate={{ rotate: 360 }}
                transition={spinTransition}
            />
        </div>
    )
}