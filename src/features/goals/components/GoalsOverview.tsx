import {OverviewBanner} from '@/components/OverviewBanner';
import {formatCurrency} from '@/utils';

type GoalsOverviewProps = {
  saved: number;
  target: number;
  count: number;
  onAdd?: () => void;
};

export const GoalsOverview = (props: GoalsOverviewProps) => {
  const {saved, target, count, onAdd} = props;

  return (
    <OverviewBanner
      title="Ahorrado en tus metas"
      amount={saved}
      meta={`de $ ${formatCurrency(target)} · ${count} ${count === 1 ? 'meta' : 'metas'}`}
      actionLabel="Nueva meta"
      onAction={onAdd}
    />
  );
};
