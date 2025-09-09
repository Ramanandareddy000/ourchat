import React from 'react';
import styled from 'styled-components';

const LogoSvg = styled.svg<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className }) => {
  return (
    <LogoSvg size={size} className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#00a884"/>
      <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </LogoSvg>
  );
};
