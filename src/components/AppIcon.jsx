// src/components/AppIcon.jsx
import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Eye, 
  Download, 
  Share2, 
  Settings,
  Home,
  ArrowLeft
} from 'lucide-react';

const AppIcon = ({ name, size = 20, className = '', ...props }) => {
  const icons = {
    Calendar,
    MapPin,
    Eye,
    Download,
    Share2,
    Settings,
    Home,
    ArrowLeft
  };

  const IconComponent = icons[name];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default AppIcon;
