import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
};

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

const cx = (...parts) => parts.filter(Boolean).join(' ');

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => observers.forEach(obs => obs?.disconnect());
  }, dependencies);
};

const useImageLoader = (seqRef, callback, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') || [];
    if (images.length === 0) {
      callback();
      return;
    }

    let loadedCount = 0;
    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) callback();
    };

    images.forEach(img => {
      if (img.complete) handleLoad();
      else {
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleLoad);
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleLoad);
      });
    };
  }, dependencies);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical) => {
  const stateRef = useRef({
    offset: 0,
    velocity: targetVelocity,
    lastTimestamp: 0
  });

  useEffect(() => {
    let animationFrameId;

    const animate = (timestamp) => {
      if (!stateRef.current.lastTimestamp) {
        stateRef.current.lastTimestamp = timestamp;
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (timestamp - stateRef.current.lastTimestamp) / 1000;
      stateRef.current.lastTimestamp = timestamp;

      const effectiveTargetVelocity = isHovered ? hoverSpeed : targetVelocity;
      stateRef.current.velocity += (effectiveTargetVelocity - stateRef.current.velocity) * ANIMATION_CONFIG.SMOOTH_TAU;

      stateRef.current.offset += stateRef.current.velocity * deltaTime;

      const limit = isVertical ? seqHeight : seqWidth;
      if (limit > 0) {
        if (stateRef.current.offset >= limit) stateRef.current.offset -= limit;
        if (stateRef.current.offset < 0) stateRef.current.offset += limit;
      }

      if (trackRef.current) {
        const translate = isVertical 
          ? `translate3d(0, ${-stateRef.current.offset}px, 0)` 
          : `translate3d(${-stateRef.current.offset}px, 0, 0)`;
        trackRef.current.style.transform = translate;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical]);
};

const LogoLoop = ({
  logos = [],
  speed = 40,
  direction = 'left',
  logoHeight = 60,
  gap = 60,
  hoverSpeed = 20,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = '#ffffff',
  isVertical = false,
  useCustomRender = false,
  ariaLabel = 'Logo loop'
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const targetVelocity = direction === 'left' || direction === 'up' ? speed : -speed;

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect?.();
    const sequenceWidth = sequenceRect?.width ?? 0;
    const sequenceHeight = sequenceRect?.height ?? 0;

    if (isVertical) {
      setSeqHeight(Math.ceil(sequenceHeight));
      const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
      const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    } else {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, [isVertical]);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical);

  const clones = useMemo(() => Array.from({ length: copyCount }).map((_, i) => (
    <div key={i} className="flex shrink-0 items-center justify-center py-4" style={{ gap: toCssLength(gap) }}>
      {logos.map((logo, idx) => (
        <div key={idx} className={cx("transition-all duration-500", scaleOnHover && "hover:scale-110")}>
          <img 
            src={logo.src} 
            alt={logo.alt || ''} 
            style={{ height: toCssLength(logoHeight), width: 'auto' }} 
            className="max-w-none transition-all duration-500 pointer-events-auto"
          />
        </div>
      ))}
    </div>
  )), [logos, gap, logoHeight, copyCount, scaleOnHover]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden w-full h-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label={ariaLabel}
    >
      <div 
        ref={trackRef} 
        className={cx("flex w-max", isVertical && "flex-col h-max")}
        style={{ gap: toCssLength(gap) }}
      >
        <div ref={seqRef} className={cx("flex shrink-0 items-center justify-center py-4", isVertical && "flex-col")} style={{ gap: toCssLength(gap) }}>
          {logos.map((logo, idx) => (
            <div key={idx} className={cx("transition-all duration-500", scaleOnHover && "hover:scale-110")}>
                <img 
                  src={logo.src} 
                  alt={logo.alt || ''} 
                  style={{ height: toCssLength(logoHeight), width: 'auto' }} 
                  className="max-w-none transition-all duration-500 pointer-events-auto"
                />
            </div>
          ))}
        </div>
        {clones}
      </div>

      {fadeOut && (
        <>
          <div 
            className="absolute inset-y-0 left-0 w-32 pointer-events-none z-20" 
            style={{ background: `linear-gradient(to right, ${fadeOutColor}, transparent)` }} 
          />
          <div 
            className="absolute inset-y-0 right-0 w-32 pointer-events-none z-20" 
            style={{ background: `linear-gradient(to left, ${fadeOutColor}, transparent)` }} 
          />
        </>
      )}
    </div>
  );
};

export default memo(LogoLoop);
