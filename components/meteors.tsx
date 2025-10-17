"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface MeteorProps {
  number?: number;
}

interface Meteor {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export const Meteors = ({ number = 20 }: MeteorProps) => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const generatedMeteors = Array.from({ length: number }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: Math.random() * 0.8 + 0.6,
    }));
    setMeteors(generatedMeteors);
  }, [number]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute w-0.5 h-24 bg-gradient-to-b from-primary to-transparent"
          style={{
            left: `${meteor.left}%`,
            top: "-100px",
            boxShadow: "0 0 20px 2px hsl(var(--primary))",
            filter: "blur(1px)",
          }}
          animate={{
            y: "100vh",
            opacity: [1, 0],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: Math.random() * 0.6 + 0.2,
          }}
        />
      ))}
    </div>
  );
};
