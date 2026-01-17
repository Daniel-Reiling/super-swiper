import type { StyleProp, ViewStyle } from 'react-native';

export type SwipeDirection = 'left' | 'right';

export interface OverlayLabel {
  element: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface OverlayLabels {
  left?: OverlayLabel;
  right?: OverlayLabel;
}

export interface SuperSwiperProps<T> {
  // Required props
  cards: T[];
  renderCard: (item: T, index: number) => React.ReactNode;

  // Configuration
  stackSize?: number; // Number of cards to render in stack (default: 3)
  swipeThreshold?: number; // Distance threshold to trigger swipe (default: screen width * 0.25)
  cardVerticalOffset?: number; // Vertical spacing between stacked cards (default: 20)
  cardScaleStep?: number; // Scale reduction per card in stack (default: 0.05)
  initialCardIndex?: number; // Starting card index (default: 0)

  // Swipe control
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;

  // Styling
  containerStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  overlayLabels?: OverlayLabels;

  // Callbacks
  onSwipedLeft?: (cardIndex: number) => void;
  onSwipedRight?: (cardIndex: number) => void;
  onSwipeStart?: (direction: SwipeDirection) => void;
  onSwipeEnd?: (cardIndex: number) => void;
  onSwipeBack?: () => void;
  onReady?: () => void;
}

export interface CardProps {
  content: React.ReactNode;
  index: number; // Absolute index in cards array
  stackPosition: number; // Position in visible stack (0 = top, 1 = second, etc.)
  zIndex: number;
  isActive: boolean; // Is this the top card that can be swiped
  cardScaleStep: number;
  cardVerticalOffset: number;
  overlayLabels?: OverlayLabels;

  // Swipe configuration
  swipeThreshold: number;
  disableLeftSwipe: boolean;
  disableRightSwipe: boolean;

  // Callbacks
  onSwipeStart?: (direction: SwipeDirection) => void;
  onSwipeComplete?: (direction: SwipeDirection) => void;
  onSwipeCancel?: () => void;
}

export interface CardHandles {
  triggerSwipeLeft: () => void;
  triggerSwipeRight: () => void;
}

export interface SuperSwiperHandles {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeBack: () => void;
  jumpToCardIndex: (index: number) => void;
}
