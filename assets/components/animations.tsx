import React, { useEffect, useRef } from "react";
import { Animated, Easing, ViewStyle } from "react-native";

type ScreenAnimProps = {
	children: React.ReactNode;
	durationMs?: number;
	style?: ViewStyle | ViewStyle[];
};

export function ScreenFadeSlide({ children, durationMs = 500, style }: ScreenAnimProps) {
	const opacity = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(12)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 1,
				duration: durationMs,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 0,
				duration: durationMs,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
		]).start();
	}, [durationMs, opacity, translateY]);

	return (
		<Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
			{children}
		</Animated.View>
	);
}

export function useStagger(count: number, baseDelayMs = 60) {
	return (index: number) => index * baseDelayMs;
}


