import React from 'react';
import { useTranslation } from 'react-i18next';

const NoMatch = () => {
  const { t } = useTranslation();
  return (<h5 className="align-self-center">{t('errors.404')}</h5>);
};

export default NoMatch;
