import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { useUIStore } from '../context/store';
import './NotificationCenter.css';

const notificationIcons = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertCircle,
  info: FiInfo,
};

export default function NotificationCenter() {
  const notification = useUIStore((state) => state.notification);
  const clearNotification = useUIStore((state) => state.clearNotification);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearNotification();
    }, 3800);

    return () => window.clearTimeout(timeoutId);
  }, [clearNotification, notification]);

  const NotificationIcon = notification ? notificationIcons[notification.type] || FiInfo : FiInfo;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className={`notification-toast ${notification.type}`}
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
        >
          <NotificationIcon size={18} />
          <span>{notification.message}</span>
          <button type="button" onClick={clearNotification} aria-label="Cerrar notificacion">
            x
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
