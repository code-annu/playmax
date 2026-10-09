import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface PrimaryButtonProps {
  /** Text label displayed inside the button */
  title?: string;
  /** Custom children, overrides or supplements title */
  children?: React.ReactNode;
  /** Function invoked when the button is pressed */
  onPress?: (event: GestureResponderEvent) => void | Promise<void>;
  /** Visual theme variant */
  variant?: ButtonVariant;
  /** Button size preset */
  size?: ButtonSize;
  /** Whether the button should occupy 100% of available width */
  fullWidth?: boolean;
  /** Disables interactions and reduces opacity */
  disabled?: boolean;
  /** Shows a loading spinner and prevents interaction */
  loading?: boolean;
  /** Icon component rendered before the title */
  leftIcon?: React.ReactNode;
  /** Icon component rendered after the title */
  rightIcon?: React.ReactNode;
  /** Custom style overrides for the button container */
  style?: StyleProp<ViewStyle>;
  /** Custom style overrides for the text label */
  textStyle?: StyleProp<TextStyle>;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test identifier */
  testID?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const isInteractive = !disabled && !loading;

  const handlePress = (e: GestureResponderEvent) => {
    if (!isInteractive || !onPress) return;
    onPress(e);
  };

  // Determine spinner color based on variant
  const getSpinnerColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return '#208AEF';
      case 'secondary':
      default:
        return '#94A3B8';
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={!isInteractive}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && isInteractive && styles.pressed,
        pressed && isInteractive && variant === 'primary' && styles.primaryPressed,
        style,
      ]}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size={size === 'sm' ? 'small' : 'small'}
            color={getSpinnerColor()}
            style={styles.spinner}
          />
        ) : (
          leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>
        )}

        {children ? (
          children
        ) : title ? (
          <Text
            style={[
              styles.textBase,
              styles[`text_${variant}`],
              styles[`textSize_${size}`],
              disabled && styles.textDisabled,
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : null}

        {!loading && rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  spinner: {
    marginRight: 8,
  },

  // Size variations
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 38,
  },
  size_md: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 50,
  },
  size_lg: {
    paddingVertical: 18,
    paddingHorizontal: 26,
    minHeight: 58,
    borderRadius: 16,
  },

  // Variant backgrounds & borders
  primary: {
    backgroundColor: '#208AEF',
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  secondary: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#208AEF',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },

  // Press states
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  primaryPressed: {
    backgroundColor: '#1A75CC',
  },
  disabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Typography
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  textSize_sm: {
    fontSize: 13,
    lineHeight: 18,
  },
  textSize_md: {
    fontSize: 15,
    lineHeight: 20,
  },
  textSize_lg: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },

  // Variant text colors
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#F1F5F9',
  },
  text_outline: {
    color: '#38BDF8',
  },
  text_ghost: {
    color: '#38BDF8',
  },
  text_danger: {
    color: '#FFFFFF',
  },
  textDisabled: {
    color: '#94A3B8',
  },
});
