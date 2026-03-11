import { forwardRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface AssistantInputProps {
    disabled?: boolean;
    onSubmit: (value: string) => void;
}

const AssistantInput = forwardRef<HTMLInputElement, AssistantInputProps>(function AssistantInput(
    { disabled, onSubmit },
    ref
) {
    const [value, setValue] = useState('');
    const reduceMotion = useReducedMotion();

    const submit = () => {
        const trimmed = value.trim();

        if (!trimmed || disabled) {
            return;
        }

        onSubmit(trimmed);
        setValue('');
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
        <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 sm:p-4">
            <label htmlFor="assistant-input" className="sr-only">
                Ask the portfolio assistant about projects, services, recommendations, or contact
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-xl transition-colors focus-within:border-primary/35">
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
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-text-muted/60 disabled:cursor-not-allowed"
                />
                <motion.button
                    type="submit"
                    whileHover={reduceMotion || disabled ? undefined : { scale: 1.03 }}
                    whileTap={reduceMotion || disabled ? undefined : { scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    disabled={disabled || !value.trim()}
                    aria-label="Send message to portfolio assistant"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-[0_12px_30px_rgba(124,58,237,0.32)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <SendHorizontal size={18} />
                </motion.button>
            </div>
        </form>
    );
});

export default AssistantInput;
