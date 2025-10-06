import React from 'react';
import {
  Phone,
  VideoCall,
  Search,
  Person,
  VolumeOff,
  VolumeUp,
  Block,
  Delete,
  AttachFile,
  PhotoCamera,
  Language,
  PhoneAndroid,
  AutoAwesome,
  Palette,
  Refresh,
  Message,
  CheckCircle,
  Error,
  Group,
  Assignment
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

export const AppIcons = {
  // Communication
  Phone: (props?: SvgIconProps) => <Phone {...props} />,
  VideoCall: (props?: SvgIconProps) => <VideoCall {...props} />,
  Search: (props?: SvgIconProps) => <Search {...props} />,

  // Actions
  Person: (props?: SvgIconProps) => <Person {...props} />,
  VolumeOff: (props?: SvgIconProps) => <VolumeOff {...props} />,
  VolumeUp: (props?: SvgIconProps) => <VolumeUp {...props} />,
  Block: (props?: SvgIconProps) => <Block {...props} />,
  Delete: (props?: SvgIconProps) => <Delete {...props} />,

  // Files & Attachments
  AttachFile: (props?: SvgIconProps) => <AttachFile {...props} />,
  PhotoCamera: (props?: SvgIconProps) => <PhotoCamera {...props} />,

  // UI & Feedback
  Language: (props?: SvgIconProps) => <Language {...props} />,
  PhoneAndroid: (props?: SvgIconProps) => <PhoneAndroid {...props} />,
  AutoAwesome: (props?: SvgIconProps) => <AutoAwesome {...props} />,
  Palette: (props?: SvgIconProps) => <Palette {...props} />,
  Refresh: (props?: SvgIconProps) => <Refresh {...props} />,

  // Status & Logging
  Message: (props?: SvgIconProps) => <Message {...props} />,
  CheckCircle: (props?: SvgIconProps) => <CheckCircle {...props} />,
  Error: (props?: SvgIconProps) => <Error {...props} />,
  Group: (props?: SvgIconProps) => <Group {...props} />,
  Assignment: (props?: SvgIconProps) => <Assignment {...props} />
} as const;

export type AppIconKey = keyof typeof AppIcons;