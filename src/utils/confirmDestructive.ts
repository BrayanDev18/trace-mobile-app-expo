import {Alert} from 'react-native';

import {haptic} from './haptics';

type ConfirmDestructiveOptions = {
  title: string;
  message: string;
  actionLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
};

export const confirmDestructive = (options: ConfirmDestructiveOptions) => {
  const {title, message, actionLabel, onConfirm, destructive = true} = options;

  Alert.alert(title, message, [
    {text: 'Cancelar', style: 'cancel'},
    {
      text: actionLabel,
      style: destructive ? 'destructive' : 'default',
      onPress: () => {
        haptic.success();
        onConfirm();
      },
    },
  ]);
};