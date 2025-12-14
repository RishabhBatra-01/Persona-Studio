import React from 'react';
import { ProgressIndicator } from './ProgressIndicator';

interface LoadingOverlayProps {
  message: string;
  estimatedTime?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, estimatedTime }) => {
  return <ProgressIndicator message={message} estimatedTime={estimatedTime} />;
};