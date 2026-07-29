import {
  IconBuildingBank,
  IconCash,
  IconCreditCard,
  IconCreditCardFilled,
  IconDeviceMobile,
  IconGift,
  IconNotes,
  IconQrcode,
  type Icon as TablerIcon,
} from '@tabler/icons-react-native';

type IconProps = {size?: number};

const makeIcon = (Icon: TablerIcon, color: string) => {
  const MethodIcon = ({size = 24}: IconProps) => <Icon size={size} color={color} />;
  return MethodIcon;
};

export type PaymentMethodProps = {
  id: string;
  labelKey: string;
  description: string;
  Icon: (props: IconProps) => React.JSX.Element;
};

export const PAYMENT_METHODS: PaymentMethodProps[] = [
  {
    id: 'cash',
    labelKey: 'payments:cash',
    description: 'Pagaste en efectivo',
    Icon: makeIcon(IconCash, '#16a34a'),
  },
  {
    id: 'debit',
    labelKey: 'payments:debit',
    description: 'Pago con débito',
    Icon: makeIcon(IconCreditCard, '#2563eb'),
  },
  {
    id: 'credit',
    labelKey: 'payments:credit',
    description: 'Pago con crédito',
    Icon: makeIcon(IconCreditCardFilled, '#7c3aed'),
  },
  {
    id: 'transfer',
    labelKey: 'payments:transfer',
    description: 'Transferencia entre cuentas',
    Icon: makeIcon(IconBuildingBank, '#0891b2'),
  },
  {
    id: 'wallet',
    labelKey: 'payments:wallet',
    description: 'Nequi, Daviplata, etc.',
    Icon: makeIcon(IconDeviceMobile, '#db2777'),
  },
  {
    id: 'qr',
    labelKey: 'payments:qr',
    description: 'Pago mediante código QR',
    Icon: makeIcon(IconQrcode, '#ea580c'),
  },
  {
    id: 'voucher',
    labelKey: 'payments:voucher',
    description: 'Bonos o tarjetas regalo',
    Icon: makeIcon(IconGift, '#d97706'),
  },
  {
    id: 'other',
    labelKey: 'payments:other',
    description: 'Cualquier otro método',
    Icon: makeIcon(IconNotes, '#737373'),
  },
];

const BY_ID: Record<string, PaymentMethodProps> = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.id, m]),
);

export const getPaymentMethod = (id: string): PaymentMethodProps | undefined => BY_ID[id];
