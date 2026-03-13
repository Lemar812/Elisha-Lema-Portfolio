import { forwardRef, useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface AssistantInputProps {
    disabled?: boolean;
    onSubmit: (value: string) => void;
    onDraftingChange?: (value: boolean) => void;
}

const AssistantInput = forwardRef<HTMLInputElement, AssistantInputProps>(function AssistantInput(
    { disabled, onSubmit, onDraftingChange },
    ref
) {
    const [value, setValue] = useState('');
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        onDraftingChange?.(value.trim().length > 0 && !disabled);
    }, [disabled, onDraftingChange, value]);

    const submit = () => {
        const trimmed = value.trim();

        if (!trimmed || disabled) {
            return;
        }

        onSubmit(trimmed);
        setValue('');
        onDraftingChange?.(false);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.repeat) {
            event.preventDefault();
            submit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative p-2.5 sm:p-3">
            <div className="pointer-events-none absolute inset-x-5 bottom-2.5 top-2.5 rounded-[22px] bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_32%)] sm:bottom-3 sm:top-3" />
            <label htmlFor="assistant-input" className="sr-only">
                Ask the portfolio assistant about projects, services, recommendations, or contact
            </label>
            <div className="relative flex items-center gap-2 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-1.5 backdrop-blur-2xl transition-colors focus-within:border-primary/35 focus-within:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))]">
                <input
                    ref={ref}
                    id="assistant-input"
                    type="text"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                    autoComplete="off"
                    disabled={disabled}
                    aria-label="Ask the portfolio assistant a question"
                    placeholder="Ask about projects, skills, services, or contact"
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-text-muted/60 disabled:cursor-not-allowed"
                />
                <motion.button
                    type="submit"
                    whileHover={reduceMotion || disabled ? undefined : { scale: 1.03 }}
                    whileTap={reduceMotion || disabled ? undefined : { scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    disabled={disabled || !value.trim()}
                    aria-label="Send message to portfolio assistant"
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,rgba(124,58,237,0.92),rgba(34,211,238,0.42))] text-white shadow-[0_12px_30px_rgba(124,58,237,0.32)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <SendHorizontal size={17} />
                </motion.button>
            </div>
        </form>
    );
});

export default AssistantInput;
