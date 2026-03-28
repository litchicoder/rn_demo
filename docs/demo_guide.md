# React Native 核心原理：现场演示指南 (Live Demo Guide)

> [!IMPORTANT]
> 本指南旨在通过实时工具，将“看不到”的底层原理（Bridge, Virtual DOM, Yoga, Fabric）可视化。

---

## 演示一：大桥间谍 (MessageQueue Spy)
**展示目标**：让观众亲眼看到 JS 和 Native 之间传输的 JSON 数据包，理解所谓的“Bridge 流量”。

### 操作步骤
1. 在应用的入口文件（通常是 `index.js` 或 `App.tsx`）顶部加入以下调试代码：
   ```javascript
   import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';

   // 开启对所有“跨桥”通信的实时监听
   MessageQueue.spy(true);
   ```
2. 运行应用，并打开控制台 (Remote Debugger)。
3. **现场观察**：
   - 快速滚动列表或点击按钮。
   - 观察控制台喷涌而出的日志。
   - **指点细节**：指着日志中的 `module` (调用的原生模块), `method` (方法名), `args` (参数)。这就是“独木桥”上的“车辆”。

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
1. 摇晃手机（或 Cmd+D / Cmd+M）调出开发者菜单。
2. 点击 **“Show Inspector”**。
3. 点击屏幕上的任意组件。
4. **现场观察**：
   - 查看 “Box Model” 选项卡。
   - **讲解核心**：在这里你能看到 Margin, Padding, Width 等数值。强调 **Yoga 引擎** 就像一个“同声传译”，迅速把你写的 `justifyContent: 'center'` 算成了几十个具体的屏幕像素位置。

---

## 演示四：流畅度大考验 (Perf Monitor)
**展示目标**：展示 JS 线程与 UI 线程的分离，理解异步渲染的优势。

### 操作步骤
1. 开发者菜单中点击 **“Show Perf Monitor”**。
2. 屏幕上会出现一个小窗口，展示 **RAM**, **JS FPS**, **UI FPS**。
3. **现场演示**：
   - 做一个极其复杂的 JS 计算（比如在一个循环里计算 100 万次）。
   - **现场观察**：你会发现 **JS FPS 骤降**，但你依然可以流畅地滑动列表（**UI FPS 保持高位**）。
   - **讲解核心**：这就是双线程的魅力。逻辑卡住了，但用户交互不会死掉。这也是 **Fabric** 新渲染引擎致力于消除“跳帧”的切入点。

---

## 演示建议配套脚本
- **开场**：“今天我们不仅谈理论，我们要通过这些监控工具，带大家钻进手机内部，看看 React Native 是怎么呼吸的。”
- **结尾**：“我们看到的每一个日志、每一次闪烁，都是 JavaScript 在与原生系统进行着每秒数百次的博弈。”
