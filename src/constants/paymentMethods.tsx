import Svg, {Circle} from 'react-native-svg';
import {IconBrandVisa, IconBuildingBank, IconCash} from '@tabler/icons-react-native';

type IconProps = {size?: number};

const CashIcon = ({size = 24}: IconProps) => <IconCash size={size} color="#16a34a" />;

const TransferIcon = ({size = 24}: IconProps) => <IconBuildingBank size={size} color="#2563eb" />;

const VisaIcon = ({size = 24}: IconProps) => <IconBrandVisa size={size} color="#1a1f71" />;

const MastercardIcon = ({size = 24}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={9} cy={12} r={7} fill="#eb001b" />
    <Circle cx={15} cy={12} r={7} fill="#f79e1b" fillOpacity={0.9} />
  </Svg>
);

export type PaymentMethod = {
  id: string;
  label: string;
  Icon: (props: IconProps) => React.JSX.Element;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {id: 'cash', label: 'Efectivo', Icon: CashIcon},
  {id: 'transfer', label: 'Transferencia', Icon: TransferIcon},
  {id: 'visa', label: 'Visa', Icon: VisaIcon},
  {id: 'mastercard', label: 'Mastercard', Icon: MastercardIcon},
];

const BY_ID: Record<string, PaymentMethod> = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.id, m]),
);

export const getPaymentMethod = (id: string): PaymentMethod | undefined => BY_ID[id];
