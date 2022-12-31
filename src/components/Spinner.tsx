import React from 'react'
import EmbeddedSpinner from './EmbeddedSpinner'

export default function Spinner() {
    return (
        // https://medium.com/@brianmutinda49/tailwind-css-center-content-vertically-and-horizontally-761d912ed199
        <div className="flex h-screen items-center justify-center">
            <EmbeddedSpinner width={10} height={10} />
            <span className="sr-only">Loading...</span>
        </div>
    )
}
