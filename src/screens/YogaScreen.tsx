import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Theme} from '../theme';
import {CustomButton} from '../components/CustomButton';

interface YogaScreenProps {
  goBack: () => void;
}

export const YogaScreen: React.FC<YogaScreenProps> = ({goBack}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📐 Yoga 测绘师</Text>
        <Text style={styles.subtitle}>同声传译 CSS Flex 到 C++ 绝对坐标</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            请长按/开启 React DevTools 的 Elements Inspector 或者打开 Flipper Layout 面板。
            将鼠标悬停在下方复杂的色块中：这在 JS 代码层只是 `flex: 1` 加上各种相对对齐，但是原生系统拿到的，全部都是精确到小数点的 `x`, `y`, `width`, `height`。这就是 C++ Yoga 引擎实时转换的结果。
          </Text>
        </View>

        {/* Complex Layout Maze */}
        <View style={styles.mazeWrapper}>
          {/* Row Start */}
          <View style={styles.row}>
            <View style={styles.boxLeft}>
              <Text style={styles.boxText}>A (Flex: 1)</Text>
            </View>
            <View style={styles.boxRight}>
              <Text style={styles.boxText}>B (Flex: 2)</Text>
            </View>
          </View>
          
          {/* Column with Justify Content Space Around */}
          <View style={styles.columnArea}>
            <View style={styles.tinySquare}></View>
            <View style={[styles.tinySquare, {backgroundColor: Theme.colors.success}]}></View>
            <View style={[styles.tinySquare, {backgroundColor: Theme.colors.error}]}></View>
          </View>

          {/* Absolute positioning mapping test */}
          <View style={styles.relativeArea}>
            <Text style={styles.absoluteTargetText}>
              I have absolute position inside a relative block. Inspect my calculated real XY vs the Flexbox styles!
            </Text>
            <View style={styles.absoluteBadge}>
                <Text style={styles.badgeText}>Badge</Text>
            </View>
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 20,
  },
  description: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    lineHeight: 22,
  },
  mazeWrapper: {
    height: 350,
    backgroundColor: Theme.colors.border + '33', // faint bg
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    height: 100,
  },
  boxLeft: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  boxRight: {
    flex: 2,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: Theme.borderRadius.sm,
  },
  boxText: {
    color: '#fff',
    fontWeight: '700',
  },
  columnArea: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly', // Yoga calculates these spaces natively
    borderTopWidth: 1,
    borderColor: Theme.colors.border,
  },
  tinySquare: {
    width: 60,
    height: 60,
    backgroundColor: Theme.colors.primary,
    borderRadius: 30, // circle
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  relativeArea: {
    height: 120,
    padding: 16,
    backgroundColor: Theme.colors.primary + '11',
    borderTopWidth: 1,
    borderColor: Theme.colors.border,
  },
  absoluteTargetText: {
    fontSize: 14,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginTop: 20,
  },
  absoluteBadge: {
    position: 'absolute',
    top: -15, // Yoga turns these into literal offset pixel mapping on the C++ root
    right: 15,
    backgroundColor: Theme.colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
  },
});
