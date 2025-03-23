declare module 'framer-motion' {
  import * as React from 'react';

  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    custom?: any;
    initial?: boolean;
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
    presenceAffectsLayout?: boolean;
    mode?: 'sync' | 'popLayout' | 'wait';
  }

  export const AnimatePresence: React.FC<AnimatePresenceProps>;

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    transformTemplate?: any;
    transformValues?: any;
    custom?: any;
    onBeforeLayoutMeasure?: any;
    onLayoutMeasure?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileDrag?: any;
    whileInView?: any;
    onPan?: any;
    onPanStart?: any;
    onPanEnd?: any;
    onViewportEnter?: any;
    onViewportLeave?: any;
    onHoverStart?: any;
    onHoverEnd?: any;
    onPointerDown?: any;
    onPointerUp?: any;
    style?: any;
    className?: string;
    [key: string]: any;
  }

  export interface HTMLMotionProps<T extends HTMLElement>
    extends React.HTMLAttributes<T>,
      MotionProps {}

  export type motion = {
    div: React.ForwardRefExoticComponent<HTMLMotionProps<HTMLDivElement>>;
    [key: string]: any;
  };

  export const motion: motion;

  export function useAnimation(): {
    start: (animation: any, options?: any) => Promise<any>;
    stop: () => void;
    set: (values: any) => void;
  };
}
