import React from "react";
import ReactLoading from "react-loading";
import "./LoadingScreen.css";

const LoadingScreen = () => {
    return (
        <div className="loading-screen-container">
            <ReactLoading type="spin" color="#FFFFFF" height={200} width={100} />
        </div>
    )
}

export default LoadingScreen;