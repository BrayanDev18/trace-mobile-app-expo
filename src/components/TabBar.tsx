import {View, Pressable, Image, useColorScheme} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconPlus} from '@tabler/icons-react-native';

import {navigate} from '@/constants';

type Route = {key: string; name: string};

type TabBarProps = {
  state: {index: number; routes: Route[]};
  navigation: {
    emit: (event: {type: 'tabPress'; target: string; canPreventDefault: true}) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

const ICONS: Record<string, number> = {
  home: require('@assets/images/tabIcons/home.png'),
  stats: require('@assets/images/tabIcons/statics.png'),
  wallet: require('@assets/images/tabIcons/wallet.png'),
  profile: require('@assets/images/tabIcons/profile.png'),
};

export const TabBar = ({state, navigation}: TabBarProps) => {
  const {bottom} = useSafeAreaInsets();
  const scheme = useColorScheme();
  const active = scheme === 'dark' ? '#ffffff' : '#000000';
  const inactive = scheme === 'dark' ? '#525252' : '#a3a3a3';

  const renderTab = (route: Route, index: number) => {
    const focused = state.index === index;
    const iconKey = route.name.split('/')[0];

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        className="flex-1 items-center justify-center py-1"
      >
        <Image
          source={ICONS[iconKey]}
          resizeMode="contain"
          style={{width: 26, height: 26, tintColor: focused ? active : inactive}}
        />
      </Pressable>
    );
  };

  const mid = Math.ceil(state.routes.length / 2);

  return (
    <View
      style={{paddingBottom: bottom || 12}}
      className="flex-row items-center px-4 pt-3 bg-primary border-t border-neutral-200/40 dark:border-neutral-900"
    >
      {state.routes.slice(0, mid).map((route, i) => renderTab(route, i))}

      <Pressable
        onPress={() => navigate('newExpense')}
        className="w-16 h-16 rounded-full items-center justify-center mx-2 bg-accent active:bg-accent-pressed"
        style={{boxShadow: '0 6px 16px rgba(5, 200, 105, 0.35)'}}
      >
        <IconPlus size={26} color="#ffffff" />
      </Pressable>

      {state.routes.slice(mid).map((route, i) => renderTab(route, mid + i))}
    </View>
  );
};
