import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium' | 'large';
}>`
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 6px 12px;
          font-size: 14px;
          min-height: 32px;
        `;
      case 'large':
        return `
          padding: 12px 24px;
          font-size: 16px;
          min-height: 48px;
        `;
      default:
        return `
          padding: 8px 16px;
          font-size: 14px;
          min-height: 40px;
        `;
    }
  }}
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: #f0f2f5;
          color: #667781;
          
          &:hover {
            background: #e4e6ea;
          }
        `;
      default:
        return `
          background: #00a884;
          color: white;
          
          &:hover {
            background: #008f6f;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
};
