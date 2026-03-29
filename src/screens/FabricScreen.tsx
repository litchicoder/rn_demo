import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {Theme} from '../theme';
import {CustomButton} from '../components/CustomButton';

interface FabricScreenProps {
  goBack: () => void;
}

export const FabricScreen: React.FC<FabricScreenProps> = ({goBack}) => {
  const [isBlocked, setBlocked] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

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
      Alert.alert('解脱了', 'JS 线程阻塞结束！刚刚这段时间你还能滑动下面的列表吗？');
    }, 100);
  };

  // 生成假数据供 ScrollView 滑动
  const dummyList = Array.from({length: 30}, (_, i) => `Native 列表项 ${i + 1}`);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 流畅度考验</Text>
        <Text style={styles.subtitle}>JS 卡死，原生到底死不死？</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            1. 请打开开发者菜单中的 **Perf Monitor** (查看 JS 和 UI 帧率)。{'\n'}
            2. 观察下方旋转的方块与滚动的列表（都跑在原生的 UI 线程）。{'\n'}
            3. 点击红色危险按钮：**JS FPS 会瞬间归 0**！但你会震撼地发现，方块仍在旋转，列表依然可以丝滑滚动！{'\n'}
            但是，如果此时用户交互需要触发 JS 更新页面（比如点赞功能），系统就会卡死。这就是 **Fabric** 架构想要通过同步调用来优化的“跳帧黑盒”。
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
                  {transform: [{rotate: spin}]},
                ]}
              />
            </View>
            <Text style={styles.statusText}>一直很丝滑的 Native</Text>
          </View>

          <View style={styles.rightPanel}>
             {/* The JS Heavy Operation */}
             <Text style={[styles.panelTitle, {color: Theme.colors.error}]}>JS Thread</Text>
             <CustomButton
                title={isBlocked ? '🥵 线程锁死中...' : '☢️ 阻塞 JS 3 秒'}
                variant={isBlocked ? 'outline' : 'primary'}
                onPress={triggerHeavyComputation}
                disabled={isBlocked}
                style={{backgroundColor: isBlocked ? 'transparent' : Theme.colors.error}}
             />
             <Text style={styles.statusTextError}>
               {isBlocked ? 'JS 帧率为 0 !' : 'JS 空闲运转中'}
             </Text>
          </View>
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
});
