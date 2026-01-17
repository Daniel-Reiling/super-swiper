import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Card from './Card';
import type {
  CardHandles,
  SuperSwiperHandles,
  SuperSwiperProps,
  SwipeDirection,
} from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DEFAULT_SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const SuperSwiper = forwardRef<SuperSwiperHandles, SuperSwiperProps<any>>(
  (props, ref) => {
    // Extract props with defaults
    const {
      cards = [],
      renderCard,
      stackSize = 3,
      swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
      cardVerticalOffset = 20,
      cardScaleStep = 0.05,
      initialCardIndex = 0,
      disableLeftSwipe = false,
      disableRightSwipe = false,
      containerStyle,
      overlayLabels,
      onSwipedLeft,
      onSwipedRight,
      onSwipeStart,
      onSwipeEnd,
      onSwipeBack,
    } = props;

    // State management
    const currentIndexRef = useRef(initialCardIndex);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [swipedCardIndices, setSwipedCardIndices] = useState<number[]>([]);
    const [_, setForceRenderKey] = useState(0);

    // Ref for the active card
    const activeCardRef = useRef<CardHandles>(null);

    // Handle swipe start
    const handleSwipeStart = (direction: SwipeDirection) => {
      setIsTransitioning(true);
      onSwipeStart?.(direction);
    };

    // Handle swipe completion
    const handleSwipeComplete = (direction: SwipeDirection) => {
      const cardIndex = currentIndexRef.current;

      // Record swiped card
      setSwipedCardIndices((prev) => [...prev, cardIndex]);

      // Trigger callbacks
      if (direction === 'left') {
        onSwipedLeft?.(cardIndex);
      } else {
        onSwipedRight?.(cardIndex);
      }
      onSwipeEnd?.(cardIndex);

      // Move to next card
      currentIndexRef.current += 1;

      // Allow new transitions and force re-render
      setIsTransitioning(false);
    };

    // Handle swipe cancel
    const handleSwipeCancel = () => {
      setIsTransitioning(false);
    };

    // Swipe left programmatically
    const swipeLeft = () => {
      if (
        disableLeftSwipe ||
        isTransitioning ||
        currentIndexRef.current >= cards.length
      ) {
        return;
      }
      activeCardRef.current?.triggerSwipeLeft();
    };

    // Swipe right programmatically
    const swipeRight = () => {
      if (
        disableRightSwipe ||
        isTransitioning ||
        currentIndexRef.current >= cards.length
      ) {
        return;
      }
      activeCardRef.current?.triggerSwipeRight();
    };

    // Swipe back to previous card
    const swipeBack = () => {
      if (currentIndexRef.current <= 0 || swipedCardIndices.length === 0) {
        return;
      }

      currentIndexRef.current -= 1;
      setSwipedCardIndices((prev) => prev.slice(0, -1));
      onSwipeBack?.();
    };

    // Jump to specific card index
    const jumpToCardIndex = (index: number) => {
      if (index < 0 || index >= cards.length) {
        return;
      }

      currentIndexRef.current = index;
      setForceRenderKey((prev) => prev + 1);
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      swipeLeft,
      swipeRight,
      swipeBack,
      jumpToCardIndex,
    }));

    // Render individual card
    const renderCardItem = (card: any, index: number) => {
      const currentIndex = currentIndexRef.current;

      // Only render cards in the visible stack
      if (index < currentIndex || index >= currentIndex + stackSize) {
        return null;
      }

      const stackPosition = index - currentIndex;
      const zIndex = cards.length - index;
      const isActive = index === currentIndex;

      const cardContent = renderCard(card, index);

      return (
        <Card
          key={card?.id || `card-${index}`}
          ref={isActive ? activeCardRef : null}
          content={cardContent}
          index={index}
          stackPosition={stackPosition}
          zIndex={zIndex}
          isActive={isActive}
          cardScaleStep={cardScaleStep}
          cardVerticalOffset={cardVerticalOffset}
          overlayLabels={overlayLabels}
          swipeThreshold={swipeThreshold}
          disableLeftSwipe={disableLeftSwipe}
          disableRightSwipe={disableRightSwipe}
          onSwipeStart={handleSwipeStart}
          onSwipeComplete={handleSwipeComplete}
          onSwipeCancel={handleSwipeCancel}
        />
      );
    };

    // Render all cards
    const renderCards = () => {
      if (currentIndexRef.current >= cards.length) {
        return null;
      }

      return cards.map((card, index) => renderCardItem(card, index));
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.cardContainer}>{renderCards()}</View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SuperSwiper;
