import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * EmptyState — friendly empty/error state block
 * @param {string}  emoji      - large emoji icon
 * @param {string}  title      - heading text
 * @param {string}  message    - sub-text
 * @param {string}  actionLabel - CTA button text (optional)
 * @param {string}  actionTo   - react-router link for CTA (optional)
 * @param {func}    onAction   - onClick handler (alternative to actionTo)
 */
const EmptyState = ({ emoji = '🚴', title = 'Nothing here yet', message = '', actionLabel, actionTo, onAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 gap-4 text-center"
  >
    <div className="text-6xl select-none">{emoji}</div>
    <h3 className="font-heading font-bold text-xl text-gray-700 dark:text-gray-300">{title}</h3>
    {message && <p className="text-gray-400 max-w-xs text-sm">{message}</p>}
    {actionLabel && (
      actionTo ? (
        <Link to={actionTo}>
          <button className="btn-primary mt-2">{actionLabel}</button>
        </Link>
      ) : (
        <button onClick={onAction} className="btn-primary mt-2">{actionLabel}</button>
      )
    )}
  </motion.div>
);

export default EmptyState;
