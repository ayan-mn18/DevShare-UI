import { useRef, MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  containerHeight?: string | number;
  containerWidth?: string | number;
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  displayOverlayContent?: boolean;
  overlayContent?: ReactNode;
}

const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = "",
  containerHeight = "300px",
  containerWidth = "100%",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  displayOverlayContent = false,
  overlayContent = null,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [rotateAmplitude, -rotateAmplitude]), {
    stiffness: 280,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-rotateAmplitude, rotateAmplitude]), {
    stiffness: 280,
    damping: 20,
  });

  const scale = useSpring(1, {
    stiffness: 280,
    damping: 20,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 200); // Amplify for effect
    y.set(yPct * 200);
  };

  const handleMouseEnter = () => {
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <div
      className={`relative z-10 flex items-center justify-center ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full rounded-[22px] transition-all duration-200 ease-linear"
      >
        <div className="relative w-full transform translate-z-[50px] [transform-style:preserve-3d]">
          {children}
        </div>

        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <motion.div
              className="transform translate-z-[80px]"
            >
              {overlayContent}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TiltedCard;
