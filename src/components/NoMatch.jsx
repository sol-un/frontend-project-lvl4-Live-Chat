import React from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  return (<h5 className="align-self-center">{t('errors.404')}</h5>);
};
