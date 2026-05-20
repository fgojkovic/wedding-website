import React, { useState, useRef, useEffect } from 'react';

/**
 * LazyBackgroundImage
 * Loads a background image only when it enters the viewport, with a blur-up effect.
 * Props:
 *   src: string (required) - image url
 *   className: string - extra classes
 *   style: object - extra styles
 *   children: ReactNode - content inside
 *   placeholder: string - optional low-res/blurred image
 */
export default function LazyBackgroundImage({ src, className = '', style = {}, children, placeholder }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const img = new window.Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [inView, src]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        backgroundImage: loaded
          ? `url('${src}')`
          : placeholder
            ? `url('${placeholder}')`
            : undefined,
        filter: !loaded && placeholder ? 'blur(20px)' : style.filter,
        transition: 'filter 0.5s, background-image 0.3s',
      }}
    >
      {children}
    </div>
  );
}
