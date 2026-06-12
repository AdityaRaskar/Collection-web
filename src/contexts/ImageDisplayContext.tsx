import React, { createContext, useContext, useState } from 'react'

type Context = {
  fill: boolean
  setFill: (v: boolean) => void
}

const ImageDisplayContext = createContext<Context | null>(null)

export const ImageDisplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fill, setFill] = useState(false)
  return <ImageDisplayContext.Provider value={{ fill, setFill }}>{children}</ImageDisplayContext.Provider>
}

export function useImageDisplay() {
  const ctx = useContext(ImageDisplayContext)
  if (!ctx) throw new Error('useImageDisplay must be used within ImageDisplayProvider')
  return ctx
}

export default ImageDisplayContext
