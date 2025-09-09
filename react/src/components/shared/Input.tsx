import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #00a884;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any custom props here if needed
}

export const Input: React.FC<InputProps> = (props) => {
  return <StyledInput {...props} />;
};
