import {useTranslation} from 'react-i18next';

import {OverviewBanner} from '@/components/OverviewBanner';

type SavingsOverviewProps = {
  saved: number;
  count: number;
  onAdd?: () => void;
};

export const SavingsOverview = (props: SavingsOverviewProps) => {
  const {saved, count, onAdd} = props;
  const {t} = useTranslation();

  return (
    <OverviewBanner
      title={t('savings:overview.title')}
      amount={saved}
      meta={t('savings:overview.meta', {count})}
      actionLabel={t('savings:newSaving')}
      onAction={onAdd}
    />
  );
};