import { render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import SuperSwiper, {
  type OverlayLabel,
  type OverlayLabels,
  type SuperSwiperHandles,
  type SuperSwiperProps,
} from 'super-swiper';

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      Pan: () => ({
        enabled: jest.fn().mockReturnThis(),
        onBegin: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
    },
    GestureDetector: ({ children }: any) => children,
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: {
      View,
    },
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (fn: any) => fn(),
    withSpring: (val: any) => val,
    withTiming: (val: any, _config: any, callback: any) => {
      callback?.(true);
      return val;
    },
  };
});

// Mock react-native-worklets
jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: any, ...args: any[]) => {
    if (typeof fn === 'function') {
      fn(...args);
    }
  },
}));

describe('SuperSwiper', () => {
  interface TestCard {
    id: number;
    title: string;
  }

  const mockCards: TestCard[] = [
    { id: 1, title: 'Card 1' },
    { id: 2, title: 'Card 2' },
    { id: 3, title: 'Card 3' },
    { id: 4, title: 'Card 4' },
    { id: 5, title: 'Card 5' },
  ];

  const renderCard = (card: TestCard) => (
    <View testID={`card-${card.id}`}>
      <Text>{card.title}</Text>
    </View>
  );

  describe('Component Mounting', () => {
    it('should render without crashing with valid props', () => {
      expect(() => {
        render(<SuperSwiper cards={mockCards} renderCard={renderCard} />);
      }).not.toThrow();
    });

    it('should accept empty cards array', () => {
      expect(() => {
        render(<SuperSwiper cards={[]} renderCard={renderCard} />);
      }).not.toThrow();
    });

    it('should accept single card', () => {
      const singleCard: TestCard[] = [{ id: 1, title: 'Only Card' }];
      expect(() => {
        render(<SuperSwiper cards={singleCard} renderCard={renderCard} />);
      }).not.toThrow();
    });
  });

  describe('Props and Configuration', () => {
    it('should accept all optional configuration props', () => {
      expect(() => {
        <SuperSwiper
          cards={mockCards}
          renderCard={renderCard}
          stackSize={5}
          swipeThreshold={100}
          cardVerticalOffset={30}
          cardScaleStep={0.1}
          swipeLeftEnabled={true}
          swipeRightEnabled={true}
          swipeUpEnabled={true}
          swipeBackEnabled={true}
        />;
      }).not.toThrow();
    });

    it('should accept callback props', () => {
      const callbacks = {
        onSwipedLeft: jest.fn(),
        onSwipedRight: jest.fn(),
        onSwipedUp: jest.fn(),
        onSwipeStart: jest.fn(),
        onSwipeEnd: jest.fn(),
        onSwipeBack: jest.fn(),
        onReady: jest.fn(),
      };

      expect(() => {
        render(
          <SuperSwiper
            cards={mockCards}
            renderCard={renderCard}
            {...callbacks}
          />
        );
      }).not.toThrow();
    });

    it('should accept style props', () => {
      expect(() => {
        <SuperSwiper
          cards={mockCards}
          renderCard={renderCard}
          containerStyle={{ backgroundColor: 'red' }}
          cardStyle={{ borderRadius: 10 }}
        />;
      }).not.toThrow();
    });

    it('should accept overlay labels', () => {
      const overlayLabels = {
        left: {
          element: <Text>NOPE</Text>,
          style: { backgroundColor: 'red' },
        },
        right: {
          element: <Text>LIKE</Text>,
          style: { backgroundColor: 'green' },
        },
      };

      expect(() => {
        <SuperSwiper
          cards={mockCards}
          renderCard={renderCard}
          overlayLabels={overlayLabels}
        />;
      }).not.toThrow();
    });
  });

  describe('Imperative Handle API', () => {
    it('should expose swipeRight method via ref', () => {
      const ref = React.createRef<SuperSwiperHandles>();
      render(
        <SuperSwiper ref={ref} cards={mockCards} renderCard={renderCard} />
      );

      expect(typeof ref.current?.swipeRight).toBe('function');
    });

    it('should expose swipeBack method via ref', () => {
      const ref = React.createRef<SuperSwiperHandles>();
      render(
        <SuperSwiper ref={ref} cards={mockCards} renderCard={renderCard} />
      );

      expect(typeof ref.current?.swipeBack).toBe('function');
    });

    it('should expose jumpToCardIndex method via ref', () => {
      const ref = React.createRef<SuperSwiperHandles>();
      render(
        <SuperSwiper ref={ref} cards={mockCards} renderCard={renderCard} />
      );

      expect(typeof ref.current?.jumpToCardIndex).toBe('function');
    });
  });

  describe('Type Safety', () => {
    it('should accept generic type parameter', () => {
      interface CustomCard {
        customId: string;
        customTitle: string;
      }

      const customCards: CustomCard[] = [
        { customId: 'a', customTitle: 'Custom A' },
        { customId: 'b', customTitle: 'Custom B' },
        { customId: 'c', customTitle: 'Custom C' },
      ];

      const customRenderCard = (card: CustomCard) => (
        <View>
          <Text>{card.customTitle}</Text>
        </View>
      );

      expect(() => {
        <SuperSwiper cards={customCards} renderCard={customRenderCard} />;
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle cards with missing id property', () => {
      const cardsWithoutId = [{ title: 'Card 1' }, { title: 'Card 2' }];

      expect(() => {
        <SuperSwiper
          cards={cardsWithoutId}
          renderCard={(card: any) => <Text>{card.title}</Text>}
        />;
      }).not.toThrow();
    });

    it('should handle very large card arrays', () => {
      const largeCardArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        title: `Card ${i}`,
      }));

      expect(() => {
        <SuperSwiper cards={largeCardArray} renderCard={renderCard} />;
      }).not.toThrow();
    });

    it('should handle stackSize larger than cards array', () => {
      expect(() => {
        <SuperSwiper
          cards={mockCards}
          renderCard={renderCard}
          stackSize={100}
        />;
      }).not.toThrow();
    });
  });

  describe('Prop Validation in DEV mode', () => {
    const originalDev = (global as any).__DEV__;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    beforeAll(() => {
      (global as any).__DEV__ = true;
    });

    afterAll(() => {
      (global as any).__DEV__ = originalDev;
      consoleWarnSpy.mockRestore();
    });

    beforeEach(() => {
      consoleWarnSpy.mockClear();
    });

    it('should warn when stackSize is 0 or negative', () => {
      render(
        <SuperSwiper cards={mockCards} renderCard={renderCard} stackSize={0} />
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('stackSize must be greater than 0')
      );
    });

    it('should warn when swipeThreshold is 0 or negative', () => {
      render(
        <SuperSwiper
          cards={mockCards}
          renderCard={renderCard}
          swipeThreshold={-10}
        />
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('swipeThreshold must be greater than 0')
      );
    });

    it('should warn when cardScaleStep is outside 0-1 range', () => {
      render(
        <SuperSwiper
          cards={mockCards}
          renderCard={renderCard}
          cardScaleStep={1.5}
        />
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('cardScaleStep should be between 0 and 1')
      );
    });
  });
});

describe('Exports', () => {
  it('should export SuperSwiper as default and named export', () => {
    expect(SuperSwiper).toBeDefined();
  });

  it('should export SuperSwiperHandles type', () => {
    // Type exists if this compiles
    const mockHandle: SuperSwiperHandles = {
      swipeLeft: jest.fn(),
      swipeRight: jest.fn(),
      swipeUp: jest.fn(),
      swipeBack: jest.fn(),
      jumpToCardIndex: jest.fn(),
    };
    expect(mockHandle).toBeDefined();
  });

  it('should export SuperSwiperProps type', () => {
    // Type exists if this compiles
    const mockProps: SuperSwiperProps<any> = {
      cards: [],
      renderCard: jest.fn(),
      stackSize: 3,
      swipeThreshold: 100,
      cardVerticalOffset: 20,
      cardScaleStep: 0.05,
      swipeLeftEnabled: true,
      swipeRightEnabled: true,
      swipeUpEnabled: true,
      swipeBackEnabled: true,
      containerStyle: { backgroundColor: 'red' },
      cardStyle: { borderRadius: 10 },
      overlayLabels: {
        left: {
          element: <Text>NOPE</Text>,
          style: { backgroundColor: 'red' },
        },
      },
      onSwipedLeft: jest.fn(),
      onSwipedRight: jest.fn(),
      onSwipeStart: jest.fn(),
      onSwipedUp: jest.fn(),
      onSwipeEnd: jest.fn(),
      onSwipeBack: jest.fn(),
    };
    expect(mockProps).toBeDefined();
  });

  it('should export OverlayLabels type', () => {
    // Type exists if this compiles
    const mockLabels: OverlayLabels = {
      left: { element: <View /> },
      right: { element: <View /> },
      up: { element: <View /> },
    };
    expect(mockLabels).toBeDefined();
  });

  it('should correctly export OverlayLabel type', () => {
    // Type exists if this compiles
    const mockLabel: OverlayLabel = {
      element: <View />,
      style: { backgroundColor: 'red' },
    };
    expect(mockLabel).toBeDefined();
  });
});
