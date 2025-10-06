import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '../../ui';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={t("chat.searchChats")}
      size="small"
    />
  );
};
