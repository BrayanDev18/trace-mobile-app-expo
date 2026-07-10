import {View, useColorScheme, Pressable} from 'react-native';

import {DottedGlowBackground, Text} from '@/components';
import {cn, formatCurrency} from '@/utils';
import {IconPlus} from "@tabler/icons-react-native";
import {router} from "expo-router";
import {ScreenRoutes} from "@/constants";

type GoalSegment = {
  id: string;
  tint: string;
  saved: number;
};

type GoalsOverviewProps = {
  saved: number;
  target: number;
  count: number;
  segments: GoalSegment[];
};

export const GoalsOverview = (props: GoalsOverviewProps) => {
  const {saved, target, count} = props;

  const dark = useColorScheme() === 'dark';
  const display = formatCurrency(saved);
  const size = display.length > 9 ? 'text-4xl' : 'text-5xl';

  return (

    <View className="overflow-hidden rounded-3xl">
      <DottedGlowBackground
        color="rgba(24,27,38,0.55)"
        darkColor="rgba(255,255,255,0.6)"
        gap={14}
        radius={1.5}
        opacity={0.12}
      />

      <View className="gap-5 p-5">
        <View className="gap-3">
          <Text className="text-sm text-secundary">Ahorrado en tus metas</Text>
          <Text
            numberOfLines={1}
            className={cn('font-satoshi-bold tracking-tight', size)}
            style={{fontVariant: ['tabular-nums']}}
          >
            $ {display}
          </Text>
          <Text className="text-sm text-secundary" style={{fontVariant: ['tabular-nums']}}>
            de $ {formatCurrency(target)} · {count} {count === 1 ? 'meta' : 'metas'}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push(ScreenRoutes.newGoal)}
          className="h-12 flex-row items-center justify-center gap-2 rounded-full btn-primary"
        >
          <IconPlus size={18} color={dark ? '#ffffff' : '#171717'}/>
          <Text className="font-satoshi-bold text-sm">Nueva meta</Text>
        </Pressable>
      </View>
    </View>
  );
};
