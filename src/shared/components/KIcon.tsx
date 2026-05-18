import React from 'react';
import * as Icons from '@tabler/icons-react';

interface KIconProps extends Icons.IconProps {
  name: keyof typeof Icons;
  size?: number | string;
  className?: string;
}

/**
 * @description Global Icon component using Tabler Icons
 * @param {KIconProps} props - Component properties
 * @returns {JSX.Element} Icon component
 */
const KIcon: React.FC<KIconProps> = ({ name, size = 20, className, ...props }) => {
  const IconComponent = Icons[name] as React.ElementType;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in @tabler/icons-react`);
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default KIcon;
