import * as Haptics from 'expo-haptics';

const isIOS = process.env.EXPO_OS === 'ios';

/** Escalera háptica de design.md §6, gated a iOS. Un gesto = un feedback. */
export const haptic = {
  tap: () => {
    if (isIOS) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  select: () => {
    if (isIOS) void Haptics.selectionAsync();
  },
  success: () => {
    if (isIOS) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  error: () => {
    if (isIOS) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
