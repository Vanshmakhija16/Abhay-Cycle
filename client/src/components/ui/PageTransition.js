import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition — lightweight fade+slide entrance only.
 * NO exit animation — exit animations combined with AnimatePresence
 * caused pages to appear frozen/reloading during navigation.
 */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="page-wrapper"
  >
    {children}
  </motion.div>
);

export default PageTransition;
