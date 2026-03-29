import React, { useState, useEffect, useRef, memo } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Theme } from '../theme';
import { CustomButton } from '../components/CustomButton';

// A custom hook to visualize component re-renders
const useRenderFlash = () => {
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset and trigger the flash animation on every render
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false, // color interpolation cannot use native driver
    }).start();
  }); // Note: No dependency array, deliberately runs on EVERY render

  const borderColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#00ff00'], // Flash green
  });

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'rgba(0, 255, 0, 0.15)'], // Slight flash green background
  });

  return { borderColor, backgroundColor, borderWidth: 3 };
};

const BlinkingTimer = () => {
  const [time, setTime] = useState(Date.now());
  const flashStyle = useRenderFlash();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000); // 1 second update so flash is visible
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[styles.timerContainer, flashStyle]}>
      <Text style={styles.timerText}>{time}</Text>
      <Text style={styles.subText}>组件内自更新 (每秒)</Text>
    </Animated.View>
  );
};

// Static components to test rendering
const NormalBox = ({ title, desc }: { title: string; desc: string }) => {
  const flashStyle = useRenderFlash();
  return (
    <Animated.View style={[styles.staticBox, flashStyle]}>
      <Text style={styles.staticTitle}>{title}</Text>
      <Text style={styles.staticDesc}>{desc}</Text>
    </Animated.View>
  );
};

const MemoizedBox = memo(({ title, desc }: { title: string; desc: string }) => {
  const flashStyle = useRenderFlash();
  return (
    <Animated.View style={[styles.staticBox, flashStyle]}>
      <Text style={styles.staticTitle}>{title} 🛡️</Text>
      <Text style={styles.staticDesc}>{desc}</Text>
    </Animated.View>
  );
});

interface VDomScreenProps {
  goBack: () => void;
}

export const VDomScreen: React.FC<VDomScreenProps> = ({ goBack }) => {
  const [parentCount, setParentCount] = useState(0);
  const parentFlashStyle = useRenderFlash();

  return (
    <View style={styles.container}>
      <View style={[styles.header,]}>
        <Text style={styles.title}>👀 V-DOM 找茬</Text>
        <Text style={styles.subtitle}>虚拟 DOM 如何实现精确的局部刷新</Text>
      </View>

      <Animated.ScrollView style={styles.content} contentContainerStyle={[styles.contentContainer, parentFlashStyle]}>
        <View style={styles.card}>
          <Text style={styles.description}>
            我们内置了<Text style={{ fontWeight: 'bold', color: Theme.colors.success }}>绿框闪烁特效</Text>！
            任何组件的 render 函数执行时，它周围就会闪烁一次绿框。您可以直接用它动态演示 React 的 Virtual DOM 机制，无需连接电脑。
          </Text>
        </View>

        {/* This is the only component that will re-render frequently independently */}
        <BlinkingTimer />

        <View style={styles.actionRow}>
          <CustomButton
            title={`触发父组件更新 (Count: ${parentCount})`}
            onPress={() => setParentCount(p => p + 1)}
            variant="primary"
          />
        </View>

        <NormalBox
          title="普通级联渲染的组件"
          desc="父组件更新时我就会跟着重渲染（闪烁），但此时整个外层并没有全屏闪，说明我的实际 DOM 也没重新创建，这就是 Virtual DOM Diff 的结果。"
        />

        <MemoizedBox
          title="React.memo 保护的组件"
          desc="即使父组件整改更新，只要我的 props 不变，我的整个 render 函数都不会执行（连闪烁都不会发生）。"
        />

      </Animated.ScrollView>

      <View style={styles.footer}>
        <CustomButton title="🔙 返回首页" onPress={goBack} variant="outline" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    gap: 16,
    borderWidth: 3, // For parent flash
  },
  card: {
    backgroundColor: Theme.colors.primary + '11',
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    lineHeight: 22,
  },
  actionRow: {
    marginVertical: 10,
  },
  staticBox: {
    backgroundColor: Theme.colors.surface,
    padding: 20,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 3,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
  },
  staticTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  staticDesc: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  timerContainer: {
    backgroundColor: Theme.colors.error + '1A',
    borderColor: Theme.colors.error,
    borderWidth: 3,
    borderRadius: Theme.borderRadius.md,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.error,
    fontFamily: 'Courier',
  },
  subText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 8,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
});
