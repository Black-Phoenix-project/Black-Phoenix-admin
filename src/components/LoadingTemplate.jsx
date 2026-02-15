import React from 'react'

const LoadingTemplate = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-warning text-lg animate-pulse">
                <span className="loading loading-bars loading-md text-warning"></span>
            </div>
        </div>
    )
}

export default LoadingTemplate