import React from 'react';
import {
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  ListItemText,
  Divider,
  MenuProps as MuiMenuProps
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

export interface MenuItemConfig {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'item' | 'divider';
  disabled?: boolean;
}

interface AppMenuProps {
  menuItems: MenuItemConfig[];
  anchorEl?: Element | null;
  open?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  triggerIcon?: React.ReactNode;
  triggerProps?: any;
  menuProps?: Partial<MuiMenuProps>;
}

const StyledMenu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
    minWidth: 180,
    boxShadow: theme.shadows[8],
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const AppMenu: React.FC<AppMenuProps> = ({
  menuItems,
  anchorEl,
  open = false,
  onToggle,
  onClose,
  triggerIcon = <MoreVertIcon />,
  triggerProps = {},
  menuProps = {},
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = open || Boolean(menuAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onToggle) {
      onToggle();
    } else {
      setMenuAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setMenuAnchorEl(null);
    }
  };

  const handleMenuItemClick = (item: MenuItemConfig) => {
    if (item.onClick) {
      item.onClick();
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        {...triggerProps}
      >
        {triggerIcon}
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl || menuAnchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        {...menuProps}
      >
        {menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={index} />;
          }

          return (
            <StyledMenuItem
              key={index}
              onClick={() => handleMenuItemClick(item)}
              disabled={item.disabled}
            >
              {item.icon && <span style={{ marginRight: 12 }}>{item.icon}</span>}
              <ListItemText primary={item.label} />
            </StyledMenuItem>
          );
        })}
      </StyledMenu>
    </>
  );
};