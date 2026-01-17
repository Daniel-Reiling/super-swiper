import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { CardHandles, CardProps, SwipeDirection } from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_OUT_DURATION = 150;

const Card = forwardRef<CardHandles, CardProps>((props, ref) => {
  const {
    content,
    stackPosition,
    zIndex,
    isActive,
    cardScaleStep,
    cardVerticalOffset,
    overlayLabels,
    swipeThreshold,
    disableLeftSwipe,
    disableRightSwipe,
    onSwipeStart,
    onSwipeComplete,
  } = props;

  // Shared values for animations
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
  }, [opacity]);

  // Trigger swipe left programmatically
  const triggerSwipeLeft = () => {
    triggerFullSwipe('left');
  };

  // Trigger swipe right programmatically
  const triggerSwipeRight = () => {
    triggerFullSwipe('right');
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    triggerSwipeLeft,
    triggerSwipeRight,
  }));

  const notifySwipeCompleted = useCallback(
    (direction: SwipeDirection) => {
      onSwipeComplete?.(direction);
    },
    [onSwipeComplete]
  );

  const triggerFullSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (direction === 'left' && !disableLeftSwipe) {
        onSwipeStart?.('left');

        offsetX.value = withTiming(
          -SCREEN_WIDTH - 100,
          { duration: SWIPE_OUT_DURATION },
          (finished) => {
            if (finished) {
              scheduleOnRN(notifySwipeCompleted, 'left');
            }
          }
        );
      } else if (direction === 'right' && !disableRightSwipe) {
        onSwipeStart?.('right');

        offsetX.value = withTiming(
          SCREEN_WIDTH + 100,
          { duration: SWIPE_OUT_DURATION },
          (finished) => {
            if (finished) {
              scheduleOnRN(notifySwipeCompleted, 'right');
            }
          }
        );
      }
    },
    [
      disableLeftSwipe,
      disableRightSwipe,
      onSwipeStart,
      offsetX,
      notifySwipeCompleted,
    ]
  );

  // Pan gesture handler - only active for the top card
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(isActive)
        .onBegin(() => {
          isDragging.value = true;
        })
        .onUpdate((event) => {
          // Only allow horizontal movement
          offsetX.value = event.translationX;
          // Add subtle vertical lift based on horizontal distance
          offsetY.value = Math.abs(event.translationX) * -0.1;
          // Subtle scale effect
          scale.value = 1 + Math.abs(event.translationX) * 0.0001;
        })
        .onEnd((event) => {
          isDragging.value = false;
          const { translationX } = event;

          const shouldSwipe = Math.abs(translationX) > swipeThreshold;
          const swipeDirection = translationX > 0 ? 'right' : 'left';

          if (shouldSwipe && swipeDirection === 'left' && !disableLeftSwipe) {
            scheduleOnRN(triggerFullSwipe, 'left');
          } else if (
            shouldSwipe &&
            swipeDirection === 'right' &&
            !disableRightSwipe
          ) {
            scheduleOnRN(triggerFullSwipe, 'right');
          } else {
            offsetX.value = withSpring(0);
            offsetY.value = withSpring(0);
            scale.value = withSpring(1);
          }
        }),
    [
      isActive,
      disableLeftSwipe,
      disableRightSwipe,
      swipeThreshold,
      triggerFullSwipe,
      isDragging,
      offsetX,
      offsetY,
      scale,
    ]
  );

  // Main card animation style
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate target scale based on stack position
    const targetScale = 1 - stackPosition * cardScaleStep;

    // Calculate vertical offset - cards peek from the top
    const verticalOffset = -stackPosition * cardVerticalOffset;

    // For the active card, use the dynamic values
    // For other cards, use spring animation to target positions
    const currentScale = isActive
      ? isDragging.value
        ? scale.value
        : withSpring(targetScale)
      : withSpring(targetScale);
    const currentX = isActive ? offsetX.value : withSpring(0);
    const currentY = isActive
      ? isDragging.value
        ? offsetY.value
        : withSpring(verticalOffset)
      : withSpring(verticalOffset);

    // Rotation only for active card
    const rotation = isActive ? offsetX.value * -0.05 : 0;

    return {
      position: 'absolute',
      width: '100%',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex,
      opacity: opacity.value,
      transform: [
        { scale: currentScale },
        { translateX: currentX },
        { translateY: currentY },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const leftOverlayAnimatedStyle = useAnimatedStyle(() => {
    if (!isActive || !overlayLabels?.left) return { opacity: 0 };
    const newOpacity = Math.max(0, Math.min(1, -offsetX.value / 100));
    return { opacity: newOpacity };
  });

  const rightOverlayAnimatedStyle = useAnimatedStyle(() => {
    if (!isActive || !overlayLabels?.right) return { opacity: 0 };
    const newOpacity = Math.max(0, Math.min(1, offsetX.value / 100));
    return { opacity: newOpacity };
  });

  console.log('Re-rendering Card: ', stackPosition);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        {content}

        {/* Overlay labels */}
        {overlayLabels?.left && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              },
              overlayLabels.left.style,
              leftOverlayAnimatedStyle,
            ]}
            pointerEvents="none"
          >
            {overlayLabels.left.element}
          </Animated.View>
        )}

        {overlayLabels?.right && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              },
              overlayLabels.right.style,
              rightOverlayAnimatedStyle,
            ]}
            pointerEvents="none"
          >
            {overlayLabels.right.element}
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
});

export default React.memo(Card);
