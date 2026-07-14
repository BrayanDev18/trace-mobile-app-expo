import {OverviewBanner} from '@/components/OverviewBanner';
import {formatCurrency} from '@/utils';

type DebtsOverviewProps = {
  lent: number;
  owed: number;
  count: number;
  onAdd?: () => void;
};

export const DebtsOverview = (props: DebtsOverviewProps) => {
  const {lent, owed, count, onAdd} = props;

  return (
    <OverviewBanner
      title="Balance de deudas"
      amount={lent - owed}
      meta={`Te deben $ ${formatCurrency(lent)} · Debes $ ${formatCurrency(owed)} · ${count} ${count === 1 ? 'activa' : 'activas'}`}
      actionLabel="Nueva deuda"
      onAction={onAdd}
    />
  );
};
