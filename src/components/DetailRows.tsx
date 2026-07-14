import {Fragment} from 'react';
import {View} from 'react-native';

import {Group, Row, Separator} from '@/components/Group';
import {Text} from '@/components/Text';

export type DetailRow = {
  label: string;
  value: string;
  tabular?: boolean;
};

type DetailRowsProps = {
  title: string;
  rows: DetailRow[];
};

export const DetailRows = ({title, rows}: DetailRowsProps) => (
  <View className="gap-2">
    <Text className="px-4 font-satoshi-medium text-lg">{title}</Text>

    <Group>
      {rows.map((row, index) => (
        <Fragment key={row.label}>
          {index > 0 && <Separator />}
          <Row label={row.label}>
            <Text
              className="text-secundary"
              style={row.tabular ? {fontVariant: ['tabular-nums']} : undefined}
            >
              {row.value}
            </Text>
          </Row>
        </Fragment>
      ))}
    </Group>
  </View>
);