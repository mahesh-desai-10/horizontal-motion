
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import "./ScrollReveal.css";

function Word({
  word,
  index,
  total,
  progress,
  distance,
  duration,
  reduceMotion,
}) {
  const start = (index / total) * (1 - duration);
  const end = Math.min(start + duration, 1);

  const opacity = useTransform(
    progress,
    [start, end],
    [0, 1]
  );

  const x = useTransform(
    progress,
    [start, end],
    [distance, 0]
  );

  const skewX = useTransform(
    progress,
    [start, end],
    [5, 0]
  );

  return (
    <>
      <motion.span
        className="motion-kit-word"
        style={
          reduceMotion
            ? { opacity: 1, x: 0, skewX: 0 }
            : { opacity, x, skewX }
        }
      >
        {word}
      </motion.span>
      {index < total - 1 ? " " : ""}
    </>
  );
}

export function ScrollReveal({
  text,
  distance = 115,
  duration = 0.09,
  fontSize = "clamp(30px, 4.15vw, 58px)",
  color = "inherit",
  sectionHeight = "240vh",
  className = "",
}) {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const words = text.trim().split(/\s+/);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      className={`motion-kit-section ${className}`}
      style={{ "--motion-kit-height": sectionHeight }}
    >
      <div className="motion-kit-sticky">
        <div className="motion-kit-container">
          <p
            className="motion-kit-text"
            style={{ fontSize, color }}
            aria-label={text}
          >
            {words.map((word, index) => (
              <Word
                key={`${word}-${index}`}
                word={word}
                index={index}
                total={words.length}
                progress={progress}
                distance={distance}
                duration={duration}
                reduceMotion={reduceMotion}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ScrollReveal;
