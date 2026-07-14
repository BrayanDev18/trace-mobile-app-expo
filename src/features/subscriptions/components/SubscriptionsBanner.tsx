import {OverviewBanner} from '@/components/OverviewBanner';

type SubscriptionsBannerProps = {
  monthlyTotal: number;
  count: number;
  onAdd?: () => void;
};

export const SubscriptionsBanner = ({monthlyTotal, count, onAdd}: SubscriptionsBannerProps) => (
  <OverviewBanner
    title="Gasto mensual en suscripciones"
    amount={monthlyTotal}
    meta={`${count} ${count === 1 ? 'suscripción activa' : 'suscripciones activas'}`}
    actionLabel="Agregar suscripción"
    onAction={onAdd}
  />
);
