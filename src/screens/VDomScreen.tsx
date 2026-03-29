import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from '../theme';
import {CustomButton} from '../components/CustomButton';

const BlinkingTimer = () => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 100); // Very fast update (10 times a second)
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{time}</Text>
    </View>
  );
};

interface VDomScreenProps {
  goBack: () => void;
}

export const VDomScreen: React.FC<VDomScreenProps> = ({goBack}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👀 V-DOM 找茬</Text>
        <Text style={styles.subtitle}>虚拟 DOM 如何实现精确的局部刷新</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            请打开 React DevTools，开启「Highlight updates when components render」选项。
            接下来，您将看到界面中只有下方红框内不断跳动的时间数字周围闪烁绿框。虽然它们在同一个屏幕里，但由于周围静态文字的状态未变，React 的 Virtual DOM 阻断了它们触发原生测绘和重绘！
          </Text>
        </View>

        <View style={styles.staticBox}>
          <Text style={styles.staticTitle}>不变的静态组件区块A</Text>
          <Text style={styles.staticDesc}>
            即使外部状态翻天覆地，只要我的 props 和 state 没变，我就岿然不动。
          </Text>
        </View>

        {/* This is the only component that will re-render frequently */}
        <BlinkingTimer />

        <View style={styles.staticBox}>
          <Text style={styles.staticTitle}>不变的静态组件区块B</Text>
          <Text style={styles.staticDesc}>
            这就是 React 之所以“React”的魔法根源。
          </Text>
        </View>
      </View>

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
    padding: 24,
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    backgroundColor: Theme.colors.primary + '11',
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    lineHeight: 22,
  },
  staticBox: {
    backgroundColor: Theme.colors.surface,
    padding: 20,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
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
  },
  timerContainer: {
    backgroundColor: Theme.colors.error + '1A',
    borderColor: Theme.colors.error,
    borderWidth: 2,
    borderRadius: Theme.borderRadius.md,
    padding: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: '900',
    color: Theme.colors.error,
    fontFamily: 'Courier',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
});
