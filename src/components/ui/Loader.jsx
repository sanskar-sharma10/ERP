import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Loader.css';

/**
 * Premium preloader component for Univers-One ERP.
 * Integrates GSAP media matching, smooth entrance and exit transitions,
 * dynamic progress ticking, and styled vector brackets around cycling developer messages.
 */
export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const smallCardRef = useRef(null);
  const largeCardRef = useRef(null);
  const smallImgRef = useRef(null);
  const largeImgRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing ControlCenter');

  // ERP Bootstrapping Stage text
  const stages = [
    { threshold: 0, text: 'Establishing secure link' },
    { threshold: 18, text: 'Connecting to local Node server' },
    { threshold: 42, text: 'Validating SKU inventory database schema' },
    { threshold: 65, text: 'Synchronizing financial ledger' },
    { threshold: 85, text: 'Optimizing glassmorphic client views' },
    { threshold: 97, text: 'Ready to initialize' }
  ];

  useEffect(() => {
    // Set initial off-states
    gsap.set([smallCardRef.current, largeCardRef.current], { 
      display: 'none', 
      opacity: 0, 
      scale: 0.8 
    });
    
    // Create GSAP Match Media context
    const mm = gsap.matchMedia();
    
    mm.add({
      isSmall: "(max-width: 800px)",
      isLarge: "(min-width: 801px)"
    }, (c) => {
      const { isSmall, isLarge } = c.conditions;
      
      if (isSmall) {
        gsap.set(largeCardRef.current, { display: 'none' });
        gsap.set(smallCardRef.current, { display: 'flex' });
        
        // Entrance animation
        gsap.to(smallCardRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.3)"
        });
        
        // Infinite rotation (clockwise)
        gsap.to(smallImgRef.current, {
          rotation: 360,
          repeat: -1,
          ease: "none",
          duration: 2.2
        });
      }
      
      if (isLarge) {
        gsap.set(smallCardRef.current, { display: 'none' });
        gsap.set(largeCardRef.current, { display: 'flex' });
        
        // Entrance animation
        gsap.to(largeCardRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.3)"
        });
        
        // Infinite rotation (counter-clockwise)
        gsap.to(largeImgRef.current, {
          rotation: -360,
          repeat: -1,
          ease: "none",
          duration: 2.2
        });
      }
    });

    // Animate progress percentage from 0 to 100
    const progressObj = { value: 0 };
    const progressTween = gsap.to(progressObj, {
      value: 100,
      duration: 3.0,
      ease: "power2.out",
      onUpdate: () => {
        const val = Math.floor(progressObj.value);
        setProgress(val);
        
        // Update horizontal progress bar width
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${val}%`;
        }
        
        // Cycle status messages
        const activeStage = [...stages].reverse().find(s => val >= s.threshold);
        if (activeStage) {
          setStatusText(activeStage.text);
        }
      },
      onComplete: () => {
        // Exit transition: Shrink the glass panel, then fade the overlay
        const tl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
        
        tl.to([smallCardRef.current, largeCardRef.current], {
          scale: 0.9,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in"
        })
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut"
        }, "-=0.25");
      }
    });

    // Cleanup all tweens and matchMedia listeners on unmount
    return () => {
      mm.revert();
      progressTween.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="erp-preloader-overlay">
      {/* Background aesthetics */}
      <div className="erp-preloader-grid" />
      <div className="erp-preloader-glow" />
      
      {/* Small Loader Layout */}
      <div ref={smallCardRef} className="erp-preloader-card small">
        <div className="erp-preloader-spinner-wrapper">
          <div className="erp-preloader-ring-outer" />
          <div className="erp-preloader-ring-inner" />
          <img 
            ref={smallImgRef} 
            src="https://assets.codepen.io/16327/scroll-flair-2.png" 
            alt="Rotating Icon" 
            className="erp-preloader-img" 
          />
        </div>
      </div>

      {/* Large Loader Layout */}
      <div ref={largeCardRef} className="erp-preloader-card large">
        <div className="erp-preloader-spinner-wrapper">
          <div className="erp-preloader-ring-outer" />
          <div className="erp-preloader-ring-inner" />
          <img 
            ref={largeImgRef} 
            src="https://assets.codepen.io/16327/scroll-flair-2.png" 
            alt="Rotating Icon" 
            className="erp-preloader-img" 
          />
        </div>
      </div>

      {/* Info & progress ticker */}
      <div className="erp-preloader-info">
        <div className="erp-preloader-percentage">
          {progress}%
        </div>
        
        <div className="erp-preloader-braces">
          {statusText}
        </div>
        
        <div className="erp-preloader-progress-track">
          <div ref={progressBarRef} className="erp-preloader-progress-bar" />
        </div>
      </div>
    </div>
  );
}
