import {FlatList, View, useWindowDimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components';

import {type SlideProps} from '../slides';

type SlideCarouselProps = {
  slides: SlideProps[];
  onIndexChange: (index: number) => void;
};

export const SlideCarousel = ({slides, onIndexChange}: SlideCarouselProps) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();

  return (
    <FlatList
      data={slides}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(slide) => slide.titleKey}
      getItemLayout={(_, i) => ({length: width, offset: width * i, index: i})}
      scrollEventThrottle={16}
      onScroll={(e) => {
        const raw = Math.round(e.nativeEvent.contentOffset.x / width);
        onIndexChange(Math.max(0, Math.min(slides.length - 1, raw)));
      }}
      renderItem={({item}) => (
        <View style={{width}} className="items-center gap-4 px-8">
          <Text className="text-center font-satoshi-bold text-4xl leading-tight tracking-tight">
            {t(item.titleKey)}
          </Text>

          <Text className="text-center text-xl leading-relaxed text-secundary">
            {t(item.subtitleKey)}
          </Text>
        </View>
      )}
    />
  );
};