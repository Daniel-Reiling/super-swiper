import { Image } from 'expo-image';
import { useRef } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import SuperSwiper, {
  type OverlayLabels,
  type SuperSwiperHandles,
} from 'super-swiper';

type CardData = {
  id: string;
  imageUrl: string;
};

const cardData: CardData[] = Array.from({ length: 500 }, (_, index) => ({
  id: index.toString(),
  imageUrl: `https://picsum.photos/1000/1000?random=${index + 1}`,
}));

const App = () => {
  const superSwiperRef = useRef<SuperSwiperHandles>(null);

  const renderCard = (item: CardData) => {
    return (
      <View style={[styles.box]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
          contentFit="cover"
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <SuperSwiper
          ref={superSwiperRef}
          cards={cardData}
          renderCard={renderCard}
          overlayLabels={overlayLabels}
          stackSize={5}
          cardVerticalOffset={24}
        />

        <Button
          title="Swipe left"
          onPress={() => {
            superSwiperRef.current?.swipeLeft();
          }}
        />
        <Button
          title="Swipe up"
          onPress={() => {
            superSwiperRef.current?.swipeUp();
          }}
        />
        <Button
          title="Swipe right"
          onPress={() => {
            superSwiperRef.current?.swipeRight();
          }}
        />
        <Button
          title="Undo"
          onPress={() => {
            superSwiperRef.current?.swipeBack();
          }}
        />
        <Button
          title="Jump to first card"
          onPress={() => {
            superSwiperRef.current?.jumpToCardIndex(0);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  overlayLeftLabel: {
    backgroundColor: 'red',
    opacity: 0.5,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlayRightLabel: {
    backgroundColor: 'green',
    opacity: 0.5,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

const overlayLabels: OverlayLabels = {
  left: {
    element: <View style={styles.overlayLeftLabel} />,
  },
  right: {
    element: <View style={styles.overlayRightLabel} />,
  },
};
