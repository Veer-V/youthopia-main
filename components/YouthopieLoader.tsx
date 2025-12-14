import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader'; // Import the new Loader component

interface FullPageLoaderProps {
    isLoading: boolean;
}

const YouthopieLoader: React.FC<FullPageLoaderProps> = ({ isLoading }) => {
    const [showLoader, setShowLoader] = useState(isLoading);

    useEffect(() => {
        if (isLoading) {
            setShowLoader(true);
        } else {
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 500); // 500ms delay to ensure smooth transition
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {showLoader && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
                >
                    <div className="flex flex-col items-center">
                        {/* Use the new SVG Loader */}
                        <Loader />
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 font-bold text-slate-800 text-lg tracking-wider"
                        >
                            YOUTHOPIA
                        </motion.p>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default YouthopieLoader;
