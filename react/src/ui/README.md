# UI Component Library

This directory contains all reusable UI components built with Material-UI (MUI) for consistent design and behavior across the application.

## Structure

```
ui/
├── buttons/          # Button components
├── cards/           # Card and container components
├── display/         # Display components (avatars, badges, etc.)
├── feedback/        # Loading, error, and status components
├── forms/           # Form-related components
├── inputs/          # Input field components
├── layout/          # Layout and container components
├── navigation/      # Navigation and menu components
├── theme.ts         # MUI theme configuration
└── index.ts         # Main exports
```

## Core Components

### Buttons
- **AppButton**: Primary button component with variants (primary, secondary, danger, ghost, link)
- **AppIconButton**: Icon-only button with tooltip support and variants

### Display
- **AppAvatar**: Avatar component with online status, fallback initials, and customizable size

### Navigation
- **AppMenu**: Dropdown menu component with Material-UI styling

### Inputs
- **SearchInput**: Search field with search icon and MUI theming
- **AppMessageInput**: Message input with emoji, attachment, and camera support
- **AppTextInput**: General text input with consistent styling

### Cards
- **AppMessageBubble**: Message bubble with sender info and timestamps
- **ChatCard**: Chat/conversation card component
- **UserCard**: User display card for lists and selections

## Theme

The theme is configured in `theme.ts` and provides:
- Color palette (primary, secondary, error, warning, info, success)
- Typography system with Inter font
- Spacing and border radius standards
- Component-specific overrides for MUI components

## Usage

### Import Components
```typescript
import { AppButton, AppAvatar, AppMenu } from '../ui';
```

### Button Examples
```typescript
// Primary button
<AppButton variant="primary" onClick={handleClick}>
  Save Changes
</AppButton>

// Icon button with tooltip
<AppIconButton
  variant="primary"
  tooltip="Add user"
  onClick={handleAdd}
>
  <AddIcon />
</AppIconButton>
```

### Avatar Examples
```typescript
// Basic avatar
<AppAvatar user={user} size="medium" />

// Avatar with online status
<AppAvatar
  user={user}
  size={48}
  showOnlineStatus={true}
  onClick={handleProfileClick}
/>
```

### Menu Examples
```typescript
const menuItems = [
  { label: 'Profile', onClick: handleProfile },
  { type: 'divider' },
  { label: 'Logout', onClick: handleLogout, icon: <LogoutIcon /> }
];

<AppMenu menuItems={menuItems} />
```

## Design Principles

1. **Consistency**: All components follow the same design language and MUI patterns
2. **Accessibility**: Components include proper ARIA labels, keyboard navigation, and color contrast
3. **Responsiveness**: Components adapt to different screen sizes and orientations
4. **Customization**: Components accept props for common customizations while maintaining consistency
5. **Performance**: Components are optimized with proper memoization and efficient re-rendering

## Migration Guidelines

When converting existing components to use the centralized UI system:

1. **Replace hard-coded buttons** with `AppButton` or `AppIconButton`
2. **Replace custom avatars** with `AppAvatar`
3. **Replace custom menus** with `AppMenu`
4. **Replace custom inputs** with the appropriate input component
5. **Update styling** to use MUI theme values instead of custom CSS
6. **Remove redundant SCSS** files where components are fully replaced

### Before/After Examples

**Before (hard-coded button):**
```tsx
<button className="save-button" onClick={handleSave}>
  Save
</button>
```

**After (centralized UI):**
```tsx
<AppButton variant="primary" onClick={handleSave}>
  Save
</AppButton>
```

## Contributing

When adding new UI components:

1. **Follow MUI patterns** and use Material-UI components as the base
2. **Use the theme** for colors, spacing, and typography
3. **Add TypeScript types** for all props and interfaces
4. **Include documentation** and usage examples
5. **Export from index.ts** to make components available
6. **Test responsiveness** across different screen sizes
7. **Ensure accessibility** compliance

## Future Enhancements

- [ ] Dark mode support
- [ ] Animation library integration
- [ ] Advanced form validation components
- [ ] Data visualization components
- [ ] Accessibility testing automation
- [ ] Storybook integration for component documentation