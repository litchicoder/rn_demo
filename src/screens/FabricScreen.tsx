import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Theme } from '../theme';
import { CustomButton } from '../components/CustomButton';

interface FabricScreenProps {
  goBack: () => void;
}

export const FabricScreen: React.FC<FabricScreenProps> = ({ goBack }) => {
  const [isBlocked, setBlocked] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;
  const renderCount = useRef(0);
  
  // 每渲染一次加1，用于观察自动批处理 (Batching)
  renderCount.current += 1;

  useEffect(() => {
    // 开启原生驱动的旋转动画不受 JS 线程阻塞影响
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true, // 这是核心：把动画交给 Native 线程
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const triggerHeavyComputation = () => {
    setBlocked(true);

    // We use setTimeout to allow the UI to show the 'Blocked' state before actually locking up
    setTimeout(() => {
      const startTime = Date.now();
      const lockDuration = 3000; // 3 seconds total freeze
      console.log('--- JS Thread Lock Started ---');
      while (Date.now() - startTime < lockDuration) {
        // synchronously block JS thread
        // DO NOTHING
      }
      console.log('--- JS Thread Lock Released ---');
      setBlocked(false);
      Alert.alert('解脱了', `JS 阻塞结束！\n积压的跨端事件现已被 React 18 批处理并利用 Fabric (JSI) 一次性同步更新。`);
    }, 100);
  };

  // 生成假数据供 ScrollView 滑动
  const dummyList = Array.from({ length: 30 }, (_, i) => `Native 列表项 ${i + 1}`);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 流畅度考验</Text>
        <Text style={styles.subtitle}>Fabric 引擎 vs 老 Bridge 原理对比</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            1. 打开 **Perf Monitor** (看 JS/UI 帧率)。{'\n'}
            2. 点击<Text style={{fontWeight: 'bold', color: Theme.colors.error}}>红色锁死按钮</Text>，JS 帧率将瞬间归 0。{'\n'}
            3. **视觉震撼**：此时滑动列表、看旋转方块，依然 60 帧丝滑！(原生线程接管){'\n'}
            4. **灵魂拷问**：在 JS 锁死这 3 秒内，疯狂点击下方的交互测试按钮。观察解锁后，Fabric 是如何通过自动批处理(Batching)将原本疯狂跳帧的 UI 一步到位只渲染一次的！
          </Text>
        </View>

        <View style={styles.demoArea}>
          <View style={styles.leftPanel}>
            {/* The Native Animation Box */}
            <Text style={styles.panelTitle}>UI Thread</Text>
            <View style={styles.animContainer}>
              <Animated.View
                style={[
                  styles.box,
                  { transform: [{ rotate: spin }] },
                ]}
              />
            </View>
            <Text style={styles.statusText}>一直很丝滑的 Native</Text>
          </View>

          <View style={styles.rightPanel}>
            {/* The JS Heavy Operation */}
            <Text style={[styles.panelTitle, { color: Theme.colors.error }]}>JS Thread</Text>
            <CustomButton
              title={isBlocked ? '🥵 线程锁死中...' : '☢️ 阻塞 JS 3 秒'}
              variant={isBlocked ? 'outline' : 'primary'}
              onPress={triggerHeavyComputation}
              disabled={isBlocked}
              style={{ backgroundColor: isBlocked ? 'transparent' : Theme.colors.error }}
            />
            <Text style={styles.statusTextError}>
              {isBlocked ? 'JS 帧率为 0 !' : 'JS 空闲运转中'}
            </Text>
          </View>
        </View>

        <View style={styles.interactionArea}>
          <Text style={styles.interactionTitle}>⚡️ 交互积压测试区 (Fabric 同步渲染)</Text>
          <View style={styles.interactionRow}>
            <View style={{ flex: 1 }}>
              <CustomButton
                title={`点我 +1 (当前: ${tapCount})`}
                onPress={() => setTapCount(c => c + 1)}
                variant="primary"
              />
            </View>
            <View style={styles.interactionStats}>
              <Text style={styles.statsLabel}>UI 渲染次数:</Text>
              <Text style={styles.statsValue}>{renderCount.current}</Text>
            </View>
          </View>
          <Text style={styles.interactionDesc}>
             {isBlocked ? '⚠️ JS 已锁死！现在疯狂点击，把事件积压在底层！' : '请先点击红色按钮锁死 JS，然后再来尝试疯狂点击测试积压'}
          </Text>
        </View>

        <ScrollView style={styles.listArea}>
          {dummyList.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
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
    padding: 16,
  },
  card: {
    backgroundColor: Theme.colors.error + '11',
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.error,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    lineHeight: 22,
  },
  demoArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  leftPanel: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.success,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.error,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.success,
    marginBottom: 16,
  },
  animContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: Theme.colors.success,
    borderRadius: 8,
  },
  statusText: {
    marginTop: 16,
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
  statusTextError: {
    marginTop: 16,
    fontSize: 12,
    color: Theme.colors.error,
    fontWeight: '600',
  },
  listArea: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  listText: {
    color: Theme.colors.text,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
  interactionArea: {
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    marginBottom: 20,
  },
  interactionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.primary,
    marginBottom: 12,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  interactionStats: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statsLabel: {
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  interactionDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 12,
    fontStyle: 'italic',
  },
});
