import { useState } from 'react'

// Imagem com esqueleto de carregamento; o arredondamento vem do className do wrapper
export default function Img({ className = '', ...props }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!loaded && <span className="absolute inset-0 animate-pulse bg-line" aria-hidden="true" />}
      <img
        {...props}
        onLoad={() => setLoaded(true)}
        className={`size-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  )
}
