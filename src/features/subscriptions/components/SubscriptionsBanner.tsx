import {useTranslation} from 'react-i18next';

import {OverviewBanner} from '@/components/OverviewBanner';

type SubscriptionsBannerProps = {
  monthlyTotal: number;
  count: number;
  onAdd?: () => void;
};

export const SubscriptionsBanner = ({monthlyTotal, count, onAdd}: SubscriptionsBannerProps) => {
  const {t} = useTranslation();

  return (
    <OverviewBanner
      title={t('subscriptions:banner.title')}
      amount={monthlyTotal}
      meta={t('subscriptions:banner.activeCount', {count})}
      actionLabel={t('subscriptions:actions.add')}
      onAction={onAdd}
    />
  );
};
