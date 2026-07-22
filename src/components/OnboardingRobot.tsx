import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface OnboardingRobotProps {
    isOpen: boolean;
    onStartTour: () => void;
    onSkipAll: () => void;
}

export const OnboardingRobot: React.FC<OnboardingRobotProps> = ({ isOpen, onStartTour, onSkipAll }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-8 select-none font-sans overflow-y-auto">
                    {/* Full Dark Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
                    />

                    {/* Centered Wide Banner Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-200/80 max-w-4xl lg:max-w-5xl xl:max-w-6xl w-full overflow-hidden my-auto"
                    >
                        {/* Custom Hero Banner Image */}
                        <div className="w-full bg-[#f8fafc] flex items-center justify-center overflow-hidden">
                            <img
                                src="https://i.imgur.com/Fn8pFvZ.png"
                                alt="¡Hola! Soy Bluebot - Bienvenido a BLUENET"
                                referrerPolicy="no-referrer"
                                className="w-full h-auto max-h-[80vh] object-contain block"
                            />
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="p-4 sm:p-5 px-6 sm:px-8 bg-white flex items-center justify-between sm:justify-end gap-4 border-t border-slate-100">
                            <button
                                onClick={onSkipAll}
                                className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-[0.98] transition-all rounded-xl cursor-pointer tracking-wide"
                            >
                                Omitir
                            </button>
                            <button
                                onClick={onStartTour}
                                className="px-9 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-[#00a2e8] to-[#0082ca] hover:from-[#0092d1] hover:to-[#0072b2] active:scale-[0.98] transition-all rounded-2xl shadow-lg shadow-[#00a2e8]/35 hover:shadow-xl hover:shadow-[#00a2e8]/45 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
                            >
                                <span>Comencemos</span>
                                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
