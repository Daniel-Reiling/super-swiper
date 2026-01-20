# super-swiper

[![npm version](https://img.shields.io/npm/v/super-swiper.svg)](https://www.npmjs.com/package/super-swiper)
[![license](https://img.shields.io/npm/l/super-swiper.svg)](https://github.com/Daniel-Reiling/super-swiper/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/super-swiper.svg)](https://www.npmjs.com/package/super-swiper)

🔥 A high-performance, Tinder-like swipeable card stack built on Reanimated (v4) for React Native with smooth 60+fps animations

## 📱 Demo

<div align="center">
  <video src="https://github.com/user-attachments/assets/197f5869-baf4-4c80-af7b-bca9704c60c4" width="300" />
</div>

## 🚀 Features

- **Silky smooth animations**: Built with react-native-reanimated for native 60fps performance
- **Gesture-driven**: Powered by react-native-gesture-handler for responsive touch interactions
- **TypeScript first**: Fully typed API with comprehensive TypeScript support
- **Customizable**: Extensive props for styling, behavior, and animations
- **Imperative API**: Programmatic control via ref methods (swipe, undo, jump to card)
- **Overlay labels**: Built-in support for swipe direction indicators
- **Memory efficient**: Only renders visible cards in the stack
- **Cross-platform**: Works seamlessly on iOS, Android, and Web

## 📋 Requirements

- React Native 0.71+
- react-native-reanimated 3.0+
- react-native-gesture-handler 2.0+
- react-native-worklets 0.1+

## 📦 Installation

```sh
npm install super-swiper
```

or

```sh
yarn add super-swiper
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```sh
npx expo install react-native-reanimated react-native-gesture-handler react-native-worklets
```

or for bare React Native:

```sh
npm install react-native-reanimated react-native-gesture-handler react-native-worklets
```

### Additional Setup

#### react-native-reanimated

Add the Reanimated babel plugin to your `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

#### react-native-gesture-handler

Wrap your app with `GestureHandlerRootView`:

```jsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

## 🎯 Basic Usage

### Import the library

```tsx
import SuperSwiper, {
  SuperSwiperHandles,
  OverlayLabels
} from 'super-swiper';
```

### Simple Example

```tsx
import { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SuperSwiper, { SuperSwiperHandles } from 'super-swiper';

type CardData = {
  id: string;
  title: string;
};

const cards: CardData[] = [
  { id: '1', title: 'Card 1' },
  { id: '2', title: 'Card 2' },
  { id: '3', title: 'Card 3' },
];

export default function App() {
  const swiperRef = useRef<SuperSwiperHandles>(null);

  const renderCard = (card: CardData) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{card.title}</Text>
    </View>
  );

  return (
    <SuperSwiper
      ref={swiperRef}
      cards={cards}
      renderCard={renderCard}
      onSwipedLeft={(index) => console.log('Swiped left:', index)}
      onSwipedRight={(index) => console.log('Swiped right:', index)}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
```

### With Overlay Labels

```tsx
import { View, Text } from 'react-native';
import SuperSwiper, { OverlayLabels } from 'super-swiper';

const overlayLabels: OverlayLabels = {
  left: {
    element: (
      <View style={{ backgroundColor: '#FF6B6B', padding: 20, borderRadius: 10 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>NOPE</Text>
      </View>
    ),
    style: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: 30,
      paddingRight: 30,
    },
  },
  right: {
    element: (
      <View style={{ backgroundColor: '#4ECDC4', padding: 20, borderRadius: 10 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>LIKE</Text>
      </View>
    ),
    style: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingTop: 30,
      paddingLeft: 30,
    },
  },
};

export default function App() {
  return (
    <SuperSwiper
      cards={cards}
      renderCard={renderCard}
      overlayLabels={overlayLabels}
    />
  );
}
```

### Programmatic Control

```tsx
import { useRef } from 'react';
import { View, Button } from 'react-native';
import SuperSwiper, { SuperSwiperHandles } from 'super-swiper';

export default function App() {
  const swiperRef = useRef<SuperSwiperHandles>(null);

  return (
    <View style={{ flex: 1 }}>
      <SuperSwiper
        ref={swiperRef}
        cards={cards}
        renderCard={renderCard}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
        <Button
          title="Swipe Left"
          onPress={() => swiperRef.current?.swipeLeft()}
        />
        <Button
          title="Swipe Right"
          onPress={() => swiperRef.current?.swipeRight()}
        />
        <Button
          title="Undo"
          onPress={() => swiperRef.current?.swipeBack()}
        />
      </View>
    </View>
  );
}
```

## 📖 Complete Example

```tsx
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Image } from 'expo-image';
import SuperSwiper, {
  SuperSwiperHandles,
  OverlayLabels
} from 'super-swiper';

type Profile = {
  id: string;
  name: string;
  age: number;
  photo: string;
};

const profiles: Profile[] = [
  { id: '1', name: 'Alice', age: 28, photo: 'https://picsum.photos/400/600?random=1' },
  { id: '2', name: 'Bob', age: 32, photo: 'https://picsum.photos/400/600?random=2' },
  { id: '3', name: 'Charlie', age: 25, photo: 'https://picsum.photos/400/600?random=3' },
];

export default function App() {
  const swiperRef = useRef<SuperSwiperHandles>(null);
  const [likes, setLikes] = useState<number[]>([]);
  const [passes, setPasses] = useState<number[]>([]);

  const renderCard = (profile: Profile) => (
    <View style={styles.card}>
      <Image source={{ uri: profile.photo }} style={styles.photo} contentFit="cover" />
      <View style={styles.info}>
        <Text style={styles.name}>{profile.name}, {profile.age}</Text>
      </View>
    </View>
  );

  const overlayLabels: OverlayLabels = {
    left: {
      element: (
        <View style={styles.nopeLabel}>
          <Text style={styles.labelText}>NOPE</Text>
        </View>
      ),
      style: styles.leftLabelContainer,
    },
    right: {
      element: (
        <View style={styles.likeLabel}>
          <Text style={styles.labelText}>LIKE</Text>
        </View>
      ),
      style: styles.rightLabelContainer,
    },
  };

  return (
    <View style={styles.container}>
      <SuperSwiper
        ref={swiperRef}
        cards={profiles}
        renderCard={renderCard}
        overlayLabels={overlayLabels}
        stackSize={3}
        cardVerticalOffset={20}
        cardScaleStep={0.05}
        swipeThreshold={120}
        onSwipedLeft={(index) => {
          setPasses([...passes, index]);
          console.log('Passed on:', profiles[index].name);
        }}
        onSwipedRight={(index) => {
          setLikes([...likes, index]);
          console.log('Liked:', profiles[index].name);
        }}
        onSwipeBack={() => {
          console.log('Undid last swipe');
        }}
      />

      <View style={styles.controls}>
        <Button title="Pass" onPress={() => swiperRef.current?.swipeLeft()} />
        <Button title="Undo" onPress={() => swiperRef.current?.swipeBack()} />
        <Button title="Like" onPress={() => swiperRef.current?.swipeRight()} />
      </View>

      <View style={styles.stats}>
        <Text>Likes: {likes.length} | Passes: {passes.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  photo: {
    width: '100%',
    height: '80%',
  },
  info: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  nopeLabel: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  likeLabel: {
    backgroundColor: '#4ECDC4',
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  labelText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  leftLabelContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 30,
    paddingRight: 30,
  },
  rightLabelContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 30,
    paddingLeft: 30,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  stats: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});
```

## 🔧 API Reference

### SuperSwiper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | `T[]` | **required** | Array of data for cards to render |
| `renderCard` | `(item: T, index: number) => ReactNode` | **required** | Function to render each card |
| `stackSize` | `number` | `3` | Number of cards visible in the stack |
| `swipeThreshold` | `number` | `screen width * 0.25` | Distance in pixels to trigger a swipe |
| `cardVerticalOffset` | `number` | `20` | Vertical spacing between stacked cards |
| `cardScaleStep` | `number` | `0.05` | Scale reduction per card in stack |
| `initialCardIndex` | `number` | `0` | Index of the first card to show |
| `disableLeftSwipe` | `boolean` | `false` | Disable swiping left |
| `disableRightSwipe` | `boolean` | `false` | Disable swiping right |
| `containerStyle` | `StyleProp<ViewStyle>` | `undefined` | Style for the swiper container |
| `overlayLabels` | `OverlayLabels` | `undefined` | Overlay elements shown during swipe |
| `onSwipedLeft` | `(cardIndex: number) => void` | `undefined` | Called when card is swiped left |
| `onSwipedRight` | `(cardIndex: number) => void` | `undefined` | Called when card is swiped right |
| `onSwipeStart` | `(direction: 'left' \| 'right') => void` | `undefined` | Called when swipe gesture starts |
| `onSwipeEnd` | `(cardIndex: number) => void` | `undefined` | Called when any swipe completes |
| `onSwipeBack` | `() => void` | `undefined` | Called when undo is triggered |

### SuperSwiperHandles (Ref Methods)

Access these methods via ref:

```tsx
const swiperRef = useRef<SuperSwiperHandles>(null);
```

| Method | Parameters | Description |
|--------|------------|-------------|
| `swipeLeft()` | None | Programmatically swipe the top card left |
| `swipeRight()` | None | Programmatically swipe the top card right |
| `swipeBack()` | None | Undo the last swipe and return to previous card |
| `jumpToCardIndex(index)` | `index: number` | Jump to a specific card index |

### OverlayLabels Type

```tsx
interface OverlayLabel {
  element: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface OverlayLabels {
  left?: OverlayLabel;
  right?: OverlayLabel;
}
```

## 🎨 Customization Examples

### Custom Swipe Threshold

```tsx
<SuperSwiper
  cards={cards}
  renderCard={renderCard}
  swipeThreshold={150} // Require 150px drag to trigger swipe
/>
```

### Larger Card Stack

```tsx
<SuperSwiper
  cards={cards}
  renderCard={renderCard}
  stackSize={5} // Show 5 cards in stack
  cardVerticalOffset={15}
  cardScaleStep={0.03}
/>
```

### Disable Swipe Directions

```tsx
<SuperSwiper
  cards={cards}
  renderCard={renderCard}
  disableLeftSwipe={true} // Only allow right swipes
/>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to:
- Follow the [conventional commits](https://www.conventionalcommits.org/) specification
- Update tests as appropriate
- Run `yarn lint` and `yarn typecheck` before submitting

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Daniel Reiling

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Built with [react-native-builder-bob](https://github.com/callstack/react-native-builder-bob)
- Powered by [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth animations
- Uses [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) for gesture detection
- Inspired by [react-native-deck-swiper](https://github.com/alexbrillant/react-native-deck-swiper) and [rn-swiper-list](https://github.com/Skipperlla/rn-swiper-list)

## 🐛 Troubleshooting

### Common Issues

**Cards not rendering**
- Ensure `react-native-reanimated` babel plugin is added to `babel.config.js`
- Wrap your app with `GestureHandlerRootView`
- Clear Metro cache: `npx react-native start --reset-cache`

**Gestures not working**
- Make sure `react-native-gesture-handler` is properly installed
- Check that `GestureHandlerRootView` wraps your app
- Verify peer dependencies are installed

**Animation performance issues**
- Ensure you're running on a physical device (simulator performance may vary)
- Reduce `stackSize` to render fewer cards
- Optimize your `renderCard` function to avoid heavy computations

## 📚 Resources

- [react-native-reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [react-native-gesture-handler Documentation](https://docs.swmansion.com/react-native-gesture-handler/)
- [Example App](./example)

---

Made with ❤️ by [Daniel Reiling](https://github.com/Daniel-Reiling)
