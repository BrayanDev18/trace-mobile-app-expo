import {useTranslation} from 'react-i18next';

import {ComingSoon} from '@/components';

export default function ExploreScreen() {
  const {t} = useTranslation();

  return <ComingSoon title={t('common:nav.explore')} />;
}