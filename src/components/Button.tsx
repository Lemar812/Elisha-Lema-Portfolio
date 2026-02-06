import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const baseStyles = "relative inline-flex items-center justify-center rounded-button font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

        const variants = {
            primary: "bg-primary text-white hover:shadow-[0_10px_30px_rgba(124,58,237,0.4)]",
            secondary: "bg-secondary text-background hover:shadow-[0_10px_30px_rgba(34,211,238,0.4)]",
            outline: "border border-white/10 bg-transparent text-text-primary hover:border-white/20 hover:bg-white/5",
            ghost: "bg-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props as any}
            >
                {/* Shine sweep */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />

                <span className="relative flex items-center justify-center">
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {children}
                </span>
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
