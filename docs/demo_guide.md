# React Native 核心原理：现场演示指南 (Live Demo Guide)

> [!IMPORTANT]
> 本指南旨在通过实时工具，将“看不到”的底层原理（Bridge, Virtual DOM, Yoga, Fabric）可视化。

---

## 演示前准备 (Checklist)
> [!TIP]
> 演示确认以下几点：
> 1. 确保演示设备（手机/模拟器）与开发环境网络能够互相通信。
> 2. 提前开启 **React DevTools** 或桌面端 **Flipper**，确保能正常抓取渲染树。
> 3. 预先写好触发长耗时（如百万次循环计算）的测试按钮代码。

---

## 演示一：大桥间谍 (MessageQueue Spy)
**展示目标**：让观众亲眼看到 JS 和 Native 之间传输的 JSON 数据包，理解所谓的“Bridge 流量”。

### 操作步骤
1. 在应用的入口文件（通常是 `index.js` 或 `App.tsx`）顶部加入以下调试代码：
   ```javascript
   // 使用 __DEV__ 避免影响 Release 包
   if (__DEV__) {
     const MessageQueue = require('react-native/Libraries/BatchedBridge/MessageQueue');
     // 开启对所有“跨桥”通信的实时监听
     MessageQueue.spy(true);
   }
   ```
2. 运行应用，并打开控制台 (Remote Debugger 或 Flipper Logs)。
3. **现场观察**：
   - 快速滚动列表或点击按钮。
   - 观察控制台喷涌而出的日志。
   - **指点细节**：指着日志中的 `module` (调用的原生模块), `method` (方法名), `args` (参数)。这就是**老架构“独木桥”上的“车辆”**。
   - **高阶知识延伸**：可以顺带提一句：“这种密集的异步通信正是老架构产生通讯积压的罪魁祸首，而目前 React Native 正在全面上线的 **JSI (新架构)** 就是为了抛弃这座桥，实现 JS 与 Native 的直接同步调用。”

---

## 演示二：虚拟 DOM 的“找茬”游戏 (Highlight Updates)
**展示目标**：展示 React 的局部更新能力，证明并没有全量刷新 UI。

### 操作步骤
1. 确保已开启 **React DevTools** 独立工具或 Flipper。
2. 在 React DevTools 设置中勾选：**“Highlight updates when components render.”**
3. 在应用中执行以下操作：
   - 更新屏幕上的一小块文字（比如一个计时器）。
   - **现场观察**：屏幕上只有那块文字在闪烁绿框。
   - **讲解核心**：告诉观众，虽然 JS 重新运行了整个组件函数，但 **Virtual DOM** 对比后发现只有文字变了，所以最后它只通知原生端更新了这一个 Label。

---

## 演示三：Yoga 的布局魔法 (Inspector)
**展示目标**：展示样式坐标转换。你可以写 Flexbox，但 iOS/Android 获取的是具体的 X, Y 坐标。

### 操作步骤
1. 打开电脑端的 **Flipper (Layout 插件)** 或 **React DevTools (Elements 面板)**（大屏幕操作视觉冲击力更强）。当然，也可以摇晃手机调出系统自带的 **“Show Inspector”**。
2. 开启组件检查模式，点击屏幕上的任意 UI 元素。
3. **现场观察**：
   - 此时可以把鼠标悬浮在组件树上，让观众看到屏幕上精准框出的真实像素边界。
   - 查看 “Box Model” 或布局属性面板。
   - **讲解核心**：在这里你能看到真实的 Margin, Padding 等精确到小数的坐标值。强调 **Yoga 引擎就像一个“同声传译”**，瞬间把你写的网页端特性 `flex`, `justifyContent`, 算成了 iOS/Android 底层 UI 系统能听懂的具体 `(x, y, width, height)` 屏幕绝对物理尺寸！

---

## 演示四：流畅度大考验 (Perf Monitor)
**展示目标**：展示 JS 线程与 UI 线程的分离，理解异步渲染的优势。

### 操作步骤
1. 开发者菜单中点击 **“Show Perf Monitor”**。
2. 屏幕上会出现一个小窗口，展示 **RAM**, **JS FPS**, **UI FPS**。
3. **现场演示**：
   - 点击刚刚准备好的测试按钮，执行一段死循环般复杂的 JS 计算（比如同步计算 100 万次或者 `while(Date.now() < start + 3000)`）。
   - **现场观察**：你会发现 **JS FPS 骤降至 0**。但此时如果你去滑动屏幕上的原生 ScrollView 列表，它**依然能够流畅滑动**（UI FPS 保持在 60）。
   - **讲解核心与反转**：这是老架构“异步双线程”设计的最大特点——JS 逻辑卡住不会导致原生手势和普通滚动卡死。但这同时掩饰了巨大的风险：如果此时用户的操作需要引发**JS 状态更新**（如动画计算等），由于此时 Bridge 桥被阻塞，页面必然产生**极为严重的卡顿或白屏**。而**这就是全新 Fabric 渲染引擎出世的理由**——它通过 `JSI` 打通了同步调用的能力，允许 React 像真网页一样，在必要时立刻同步将 UI 绘制出来，从而大面积消灭这种因为异步通信积压导致的跳帧现象！

---

