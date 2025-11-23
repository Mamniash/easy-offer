'use client';

import { Avatar } from 'antd';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

type LogoAvatarProps = {
  name: string;
  size?: number;
  logo?: string;
  accent?: string;
  background?: string;
  shape?: 'circle' | 'square';
  style?: CSSProperties;
  textColor?: string;
};

const buildInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function LogoAvatar({
  name,
  size = 48,
  logo,
  accent,
  background,
  shape = 'circle',
  style,
  textColor = '#111827',
}: LogoAvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = useMemo(() => buildInitials(name), [name]);

  const backgroundStyle = useMemo(() => {
    if (background) return background;
    if (accent) return `linear-gradient(135deg, ${accent}, ${accent})`;
    return 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
  }, [accent, background]);

  const src = failed ? undefined : logo;

  return (
    <Avatar
      src={src}
      shape={shape}
      size={size}
      style={{
        background: backgroundStyle,
        color: textColor,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onError={() => {
        setFailed(true);
        return false;
      }}
    >
      {initials}
    </Avatar>
  );
}
