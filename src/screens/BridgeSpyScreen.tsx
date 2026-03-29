import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // We might not have this, let's just use raw RN APIs
import {Theme} from '../theme';
import {CustomButton} from '../components/CustomButton';

// Utility to attempt getting MessageQueue safely
const getMessageQueue = () => {
  try {
    return require('react-native/Libraries/BatchedBridge/MessageQueue');
  } catch (e) {
    return null;
  }
};

interface BridgeSpyScreenProps {
  goBack: () => void;
}

export const BridgeSpyScreen: React.FC<BridgeSpyScreenProps> = ({goBack}) => {
  const [isSpying, setIsSpying] = useState(false);

  useEffect(() => {
    // Cleanup spy on unmount
    return () => {
      const MessageQueue = getMessageQueue();
      if (MessageQueue && MessageQueue.spy) {
        MessageQueue.spy(false);
      }
    };
  }, []);

  const toggleSpy = () => {
    const MessageQueue = getMessageQueue();
    if (!MessageQueue || !MessageQueue.spy) {
      Alert.alert('错误', '无法在此 RN 版本中获取 MessageQueue 实例。');
      return;
    }

    const nextState = !isSpying;
    MessageQueue.spy(nextState);
    setIsSpying(nextState);
    if (nextState) {
      console.log('>>> 🟢 Bridge Spy 开启，请查阅终端或 Flipper Logs <<<');
    } else {
      console.log('>>> 🔴 Bridge Spy 关闭 <<<');
    }
  };

  const triggerNativeCall = () => {
    // A standard Alert is a native call that uses the Bridge
    Alert.alert(
      'Native Call Triggered',
      'Look at your console! You should see NativeModules.AlertManager.alertWithArgs(...) being sent across the Bridge.',
      [{text: 'OK', onPress: () => console.log('Alert Closed')}]
    );
  };

  const triggerAsyncStorage = () => {
    // Another common bridge call is setTimeout which calls native timing
    setTimeout(() => {
      console.log('Timer completed (Native to JS call)');
    }, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🕵️‍♂️ 大桥间谍</Text>
        <Text style={styles.subtitle}>监听 JS 与 Native 之间的 JSON 流量</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>状态控制</Text>
          <Text style={styles.description}>
            开启监听后，所有穿越“独木桥”的方法调用都会被全量打印在终端控制台中。请确保您已打开 Flipper 或 Remote Debugger。
          </Text>
          <CustomButton
            title={isSpying ? '🔴 停止监听' : '🟢 开启 Bridge Spy'}
            variant={isSpying ? 'outline' : 'primary'}
            onPress={toggleSpy}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>触发测试流量</Text>
          <Text style={styles.description}>
            点击下方按钮，观察控制台瞬间爆发的 {`{module, method, args}`} 日志记录。这就是老架构“异步积压”的根源。
          </Text>
          
          <View style={styles.buttonGroup}>
            <CustomButton
              title="触发原生弹窗 (Alert)"
              onPress={triggerNativeCall}
              variant="secondary"
            />
            <CustomButton
              title="触发定时器通信 (Timer)"
              onPress={triggerAsyncStorage}
              variant="secondary"
            />
          </View>
        </View>
      </ScrollView>

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
    padding: 24,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    padding: 20,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    lineHeight: 22,
    marginBottom: 20,
  },
  buttonGroup: {
    gap: 12,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
});
