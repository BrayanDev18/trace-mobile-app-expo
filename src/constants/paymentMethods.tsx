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

export type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  Icon: (props: IconProps) => React.JSX.Element;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cash',
    label: 'Efectivo',
    description: 'Pagaste en efectivo',
    Icon: makeIcon(IconCash, '#16a34a'),
  },
  {
    id: 'debit',
    label: 'Tarjeta de débito',
    description: 'Pago con débito',
    Icon: makeIcon(IconCreditCard, '#2563eb'),
  },
  {
    id: 'credit',
    label: 'Tarjeta de crédito',
    description: 'Pago con crédito',
    Icon: makeIcon(IconCreditCardFilled, '#7c3aed'),
  },
  {
    id: 'transfer',
    label: 'Transferencia bancaria',
    description: 'Transferencia entre cuentas',
    Icon: makeIcon(IconBuildingBank, '#0891b2'),
  },
  {
    id: 'wallet',
    label: 'Billetera digital',
    description: 'Nequi, Daviplata, etc.',
    Icon: makeIcon(IconDeviceMobile, '#db2777'),
  },
  {
    id: 'qr',
    label: 'QR',
    description: 'Pago mediante código QR',
    Icon: makeIcon(IconQrcode, '#ea580c'),
  },
  {
    id: 'voucher',
    label: 'Bono o vale',
    description: 'Bonos o tarjetas regalo',
    Icon: makeIcon(IconGift, '#d97706'),
  },
  {
    id: 'other',
    label: 'Otro',
    description: 'Cualquier otro método',
    Icon: makeIcon(IconNotes, '#737373'),
  },
];

const BY_ID: Record<string, PaymentMethod> = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.id, m]),
);

export const getPaymentMethod = (id: string): PaymentMethod | undefined => BY_ID[id];
