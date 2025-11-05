import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text, Dimensions, Easing } from "react-native";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const SplashScreen = ({ onFinish }: { onFinish?: () => void }) => {
  const screenFade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  const textFade = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Screen enter animation (fade in + slide up)
    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulsing/fading for "Shop-It"
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(textScale, {
            toValue: 1.1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textFade, {
            toValue: 0.6,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(textScale, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textFade, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnim.start();

    const timer = setTimeout(() => {
      pulseAnim.stop();
      if (onFinish) onFinish();
    }, 4000);

    return () => {
      pulseAnim.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Grocery Lottie Animation */}
      <Animated.View
        style={{
          opacity: screenFade,
          transform: [{ translateY }],
        }}
      >
        <LottieView
          source={require("@/assets/animations/grocery.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </Animated.View>

      {/* Animated Shop-It Text */}
      <Animated.Text
        style={[
          styles.brandText,
          {
            opacity: textFade,
            transform: [{ scale: textScale }],
          },
        ]}
      >
        Shop-It
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: textFade,
          },
        ]}
      >
        Freshness Delivered to You 🍎
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9", // fresh light green
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  lottie: {
    width: width * 0.75,
    height: width * 0.75,
  },
  brandText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#2E7D32",
    marginTop: 40,
    paddingHorizontal: 25,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 16,
    color: "#388E3C",
    marginTop: 10,
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    textAlign: "center",
  },
});
