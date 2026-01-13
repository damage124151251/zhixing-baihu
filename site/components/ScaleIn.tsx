'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScaleInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    initialScale?: number;
    className?: string;
    once?: boolean;
}

export default function ScaleIn({
    children,
    delay = 0,
    duration = 0.6,
    initialScale = 0.8,
    className = '',
    once = true
}: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: initialScale }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once, margin: "-50px" }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
