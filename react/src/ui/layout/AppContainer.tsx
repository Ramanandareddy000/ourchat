import React from 'react';
import { Container, ContainerProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AppContainerProps extends ContainerProps {
  centered?: boolean;
  fullHeight?: boolean;
}

const StyledContainer = styled(Container)<AppContainerProps>(({ theme, centered, fullHeight }) => ({
  ...(centered && {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  ...(fullHeight && {
    minHeight: '100vh',
  }),
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

export const AppContainer: React.FC<AppContainerProps> = ({
  children,
  centered = false,
  fullHeight = false,
  ...props
}) => {
  return (
    <StyledContainer
      centered={centered}
      fullHeight={fullHeight}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};