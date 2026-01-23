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
      swipeLeftEnabled = true,
      swipeRightEnabled = true,
      swipeUpEnabled = true,
      swipeBackEnabled = true,
      containerStyle,
      cardStyle,
      overlayLabels,
      onSwipedLeft,
      onSwipedRight,
      onSwipedUp,
      onSwipeBack,
      onSwipeStart,
      onSwipeEnd,
    } = props;

    /*
     *   Prop validation in development mode only.
     *   This helps catch errors early and prevent performance issues in production.
     */
    if (__DEV__) {
      if (stackSize <= 0) {
        console.warn('SuperSwiper: stackSize must be greater than 0');
      }
      if (swipeThreshold <= 0) {
        console.warn('SuperSwiper: swipeThreshold must be greater than 0');
      }
      if (cardScaleStep < 0 || cardScaleStep > 1) {
        console.warn('SuperSwiper: cardScaleStep should be between 0 and 1');
      }
    }

    // State management
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [swipedCardIndices, setSwipedCardIndices] = useState<number[]>([]);

    // Ref for the active card (card on the top of the stack)
    const activeCardRef = useRef<CardHandles>(null);

    // Handle swipe start
    const handleSwipeStart = (direction: SwipeDirection) => {
      setIsTransitioning(true);
      onSwipeStart?.(direction);
    };

    // Handle swipe completion
    const handleSwipeComplete = (direction: SwipeDirection) => {
      const cardIndex = currentCardIndex;

      // Record swiped card (cap at 50 to prevent memory leaks)
      setSwipedCardIndices((prev) => {
        const updated = [...prev, cardIndex];
        return updated.length > 50 ? updated.slice(-50) : updated;
      });

      // Trigger callbacks
      if (direction === 'left') {
        onSwipedLeft?.(cardIndex);
      } else if (direction === 'right') {
        onSwipedRight?.(cardIndex);
      } else if (direction === 'up') {
        onSwipedUp?.(cardIndex);
      }

      // Trigger end callback
      onSwipeEnd?.(cardIndex);

      // Move to next card
      setCurrentCardIndex((prev) => prev + 1);

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
        !swipeLeftEnabled ||
        isTransitioning ||
        currentCardIndex >= cards.length
      ) {
        return;
      }
      activeCardRef.current?.triggerSwipeLeft();
    };

    // Swipe right programmatically
    const swipeRight = () => {
      if (
        !swipeRightEnabled ||
        isTransitioning ||
        currentCardIndex >= cards.length
      ) {
        return;
      }
      activeCardRef.current?.triggerSwipeRight();
    };

    // Swipe up programmatically
    const swipeUp = () => {
      if (
        !swipeUpEnabled ||
        isTransitioning ||
        currentCardIndex >= cards.length
      ) {
        return;
      }
      activeCardRef.current?.triggerSwipeUp();
    };

    // Swipe back to previous card
    const swipeBack = () => {
      if (currentCardIndex <= 0 || swipedCardIndices.length === 0) {
        return;
      }

      setCurrentCardIndex((prev) => prev - 1);
      setSwipedCardIndices((prev) => prev.slice(0, -1));
      onSwipeBack?.();
    };

    // Jump to specific card index
    const jumpToCardIndex = (index: number) => {
      if (index < 0 || index >= cards.length) {
        return;
      }

      setCurrentCardIndex(index);
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      swipeLeft,
      swipeRight,
      swipeUp,
      swipeBack,
      jumpToCardIndex,
    }));

    // Render individual card
    const renderCardItem = (card: any, index: number) => {
      const currentIndex = currentCardIndex;

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
          cardStyle={cardStyle}
          overlayLabels={overlayLabels}
          swipeThreshold={swipeThreshold}
          swipeLeftEnabled={swipeLeftEnabled}
          swipeRightEnabled={swipeRightEnabled}
          swipeUpEnabled={swipeUpEnabled}
          swipeBackEnabled={swipeBackEnabled}
          onSwipeStart={handleSwipeStart}
          onSwipeComplete={handleSwipeComplete}
          onSwipeCancel={handleSwipeCancel}
        />
      );
    };

    // Render all cards
    const renderCards = () => {
      if (currentCardIndex >= cards.length) {
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

SuperSwiper.displayName = 'SuperSwiper';

export default SuperSwiper;
