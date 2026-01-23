import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Direction of card swipe
 */
export type SwipeDirection = 'left' | 'right' | 'up';

/**
 * Configuration for an individual overlay label shown during swipe
 */
export interface OverlayLabel {
  /** React element to display as the overlay */
  element: React.ReactNode;
  /** Optional style for the overlay container */
  style?: StyleProp<ViewStyle>;
}

/**
 * Configuration for overlay labels that appear when swiping left or right
 */
export interface OverlayLabels {
  /** Overlay shown when swiping left */
  left?: OverlayLabel;
  /** Overlay shown when swiping right */
  right?: OverlayLabel;
  /** Overlay shown when swiping up */
  up?: OverlayLabel;
}

/**
 * Props for the SuperSwiper component
 * @template T - Type of card data items
 * @example
 * ```tsx
 * const cards = [{ id: 1, name: 'Card 1' }];
 * <SuperSwiper
 *   cards={cards}
 *   renderCard={(card) => <View><Text>{card.name}</Text></View>}
 *   onSwipedLeft={(index) => console.log('Swiped left:', index)}
 * />
 * ```
 */
export interface SuperSwiperProps<T> {
  // Required props
  /** Array of card data items to render */
  cards: T[];
  /** Function that renders a card from a data item */
  renderCard: (item: T, index: number) => React.ReactNode;

  // Configuration
  /** Number of cards to render in the visible stack (default: 3) */
  stackSize?: number;
  /** Distance threshold in pixels to trigger a swipe (default: screen width * 0.25) */
  swipeThreshold?: number;
  /** Vertical spacing in pixels between stacked cards for the 3D effect (default: 20) */
  cardVerticalOffset?: number;
  /** Scale reduction per card in stack, creating depth perception (default: 0.05) */
  cardScaleStep?: number;

  // Swipe control
  /** Enable swiping left (default: true) */
  swipeLeftEnabled?: boolean;
  /** Enable swiping right (default: true) */
  swipeRightEnabled?: boolean;
  /** Enable swiping up (default: true) */
  swipeUpEnabled?: boolean;
  /** Enable swiping back (default: true) */
  swipeBackEnabled?: boolean;

  // Styling
  /** Style for the outer container */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style applied to each card */
  cardStyle?: StyleProp<ViewStyle>;
  /** Overlay labels that appear during swipe gestures */
  overlayLabels?: OverlayLabels;

  // Callbacks
  /** Called when a card is swiped left, receives the card index */
  onSwipedLeft?: (cardIndex: number) => void;
  /** Called when a card is swiped right, receives the card index */
  onSwipedRight?: (cardIndex: number) => void;
  /** Called when a card is swiped up, receives the card index */
  onSwipedUp?: (cardIndex: number) => void;
  /** Called when swipeBack() is triggered programmatically */
  onSwipeBack?: () => void;
  /** Called when a swipe gesture starts, receives the swipe direction */
  onSwipeStart?: (direction: SwipeDirection) => void;
  /** Called when a swipe completes (after animation), receives the card index */
  onSwipeEnd?: (cardIndex: number) => void;
}

/**
 * Imperative handle for controlling SuperSwiper programmatically
 * @example
 * ```tsx
 * const swiperRef = useRef<SuperSwiperHandles>(null);
 *
 * // Later in your code:
 * swiperRef.current?.swipeLeft();
 * swiperRef.current?.swipeRight();
 * swiperRef.current?.swipeBack();
 * swiperRef.current?.jumpToCardIndex(5);
 * ```
 */
export interface SuperSwiperHandles {
  /** Programmatically swipe the current card to the left */
  swipeLeft: () => void;
  /** Programmatically swipe the current card to the right */
  swipeRight: () => void;
  /** Programmatically swipe the current card to the up */
  swipeUp: () => void;
  /** Return to the previous card (undo last swipe) */
  swipeBack: () => void;
  /** Jump directly to a specific card index */
  jumpToCardIndex: (index: number) => void;
}

/**
 * Internal props for individual Card component
 * @internal - Not meant for external use
 */
export interface CardProps {
  /** Rendered card content from renderCard function */
  content: React.ReactNode;
  /** Absolute index in the cards array */
  index: number;
  /** Position in visible stack (0 = top, 1 = second, etc.) */
  stackPosition: number;
  /** Z-index for card layering */
  zIndex: number;
  /** Whether this is the active (top) card that can be swiped */
  isActive: boolean;
  /** Scale reduction per card in stack */
  cardScaleStep: number;
  /** Vertical offset between stacked cards */
  cardVerticalOffset: number;
  /** Optional overlay labels for swipe feedback */
  overlayLabels?: OverlayLabels;
  /** Optional style applied to the card */
  cardStyle?: StyleProp<ViewStyle>;

  // Swipe configuration
  /** Distance threshold to trigger swipe */
  swipeThreshold: number;
  /** Whether left swipe is enabled */
  swipeLeftEnabled: boolean;
  /** Whether right swipe is enabled */
  swipeRightEnabled: boolean;
  /** Whether swipe up is enabled */
  swipeUpEnabled: boolean;
  /** Whether swipe back is enabled */
  swipeBackEnabled: boolean;

  // Callbacks
  /** Called when swipe gesture starts */
  onSwipeStart?: (direction: SwipeDirection) => void;
  /** Called when swipe animation completes */
  onSwipeComplete?: (direction: SwipeDirection) => void;
  /** Called when swipe is cancelled (card snaps back) */
  onSwipeCancel?: () => void;
}

/**
 * Imperative handle for controlling individual Card programmatically
 * @internal - Used by SuperSwiper, not meant for external use
 */
export interface CardHandles {
  /** Trigger a left swipe animation */
  triggerSwipeLeft: () => void;
  /** Trigger a right swipe animation */
  triggerSwipeRight: () => void;
  /** Trigger a swipe up animation */
  triggerSwipeUp: () => void;
}
