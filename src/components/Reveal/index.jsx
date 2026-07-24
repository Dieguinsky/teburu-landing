import { useEffect, useRef, useState } from 'react'
import './Reveal.scss'

export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  bg,
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const mergedStyle = {
    ...style,
    ...(delay ? { transitionDelay: `${delay}ms` } : null),
    ...(bg ? { backgroundImage: isVisible ? `url(${bg})` : 'none' } : null),
  }

  return (
    <Tag
      ref={ref}
      className={['reveal', isVisible && 'reveal--visible', className].filter(Boolean).join(' ')}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Tag>
  )
}
