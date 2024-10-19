// 定义画布的宽度和高度，以及画布的中心点坐标
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;

// 定义图像的放大因子，用于调整爱心的大小
const IMAGE_ENLARGE_FACTOR = 11;

// 定义爱心的颜色
const HEART_COLOR = "#FFFFFF";

// 生成爱心上的一个点的坐标
function generateHeartCoordinate(t, shrinkRatio = IMAGE_ENLARGE_FACTOR) {
  // 使用参数t计算原始的x和y坐标
  let x = 16 * (Math.sin(t) ** 3);
  let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

  // 根据缩放比例调整x和y坐标
  x *= shrinkRatio;
  y *= shrinkRatio;

  // 将坐标转换到画布的中心
  x += CANVAS_CENTER_X;
  y += CANVAS_CENTER_Y;

  // 返回调整后的坐标，向下取整以确保坐标为整数
  return { x: Math.floor(x), y: Math.floor(y) };
}

// 绘制爱心的函数
function drawHeart(context, ratio, frame) {
  // 清空画布
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 绘制爱心的光晕部分
  let heartHaloPoints = new Set();
  for (let i = 0; i < 3000 + 4000 * Math.abs(customCurve(frame / 10 * Math.PI) ** 2); i++) {
    // 生成一个随机的t值，用于计算坐标
    let t = Math.random() * 4 * Math.PI;
    // 使用generateHeartCoordinate函数计算坐标，并使用一个更大的缩放比例来使光晕更大
    let { x, y } = generateHeartCoordinate(t, 11.5);
    // 计算一个力的大小，用于调整光晕的扩散效果
    let force = -1 / (((x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2) ** 0.6);
    // 根据力的大小调整x和y坐标
    x -= ratio * force * (x - CANVAS_CENTER_X);
    y -= ratio * force * (y - CANVAS_CENTER_Y);
    // 添加一些随机的偏移量，使光晕更加自然
    x += Math.floor(Math.random() * 29 - 14);
    y += Math.floor(Math.random() * 29 - 14);
    // 使用fillRect函数绘制一个2x2的正方形，作为光晕的一个点
    context.fillStyle = HEART_COLOR;
    context.fillRect(x, y, 2, 2);
  }

  // 绘制爱心的主体部分
  let allPoints = []; // 存储所有点的数组
  let originalPoints = new Set(); // 存储原始点的集合
  let edgeDiffusionPoints = new Set(); // 存储边缘扩散点的集合
  let centerDiffusionPoints = new Set(); // 存储中心扩散点的集合

  // 生成原始点
  for (let i = 0; i < 2000; i++) {
    let t = Math.random() * 2 * Math.PI;
    let { x, y } = generateHeartCoordinate(t);
    originalPoints.add({ x, y });
  }

  // 从原始点生成边缘扩散点
  originalPoints.forEach(({ x, y }) => {
    for (let i = 0; i < 3; i++) {
      let newX = x, newY = y;
      newX += Math.random() * 5 - 2.5;
      newY += Math.random() * 5 - 2.5;
      edgeDiffusionPoints.add({ x: newX, y: newY });
    }
  });

  // 生成中心扩散点
  for (let i = 0; i < 6000; i++) {
    let { x, y } = Array.from(originalPoints)[Math.floor(Math.random() * originalPoints.size)];
    let newX = x, newY = y;
    newX += Math.random() * 15 - 7.5;
    newY += Math.random() * 15 - 7.5;
    centerDiffusionPoints.add({ x: newX, y: newY });
  }

  // 根据力的大小调整所有点的坐标，并将它们添加到allPoints数组中
  originalPoints.forEach(({ x, y }) => {
    let newX = x, newY = y;
    let force = 1 / (((x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2) ** 0.52);
    newX -= ratio * force * (x - CANVAS_CENTER_X);
    newY -= ratio * force * (y - CANVAS_CENTER_Y);
    allPoints.push({ x: Math.floor(newX), y: Math.floor(newY), size: Math.floor(Math.random() * 3 + 1) });
  });

  edgeDiffusionPoints.forEach(({ x, y }) => {
    let newX = x, newY = y;
    let force = 1 / (((x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2) ** 0.52);
    newX -= ratio * force * (x - CANVAS_CENTER_X);
    newY -= ratio * force * (y - CANVAS_CENTER_Y);
    allPoints.push({ x: Math.floor(newX), y: Math.floor(newY), size: Math.floor(Math.random() * 2 + 1) });
  });

  centerDiffusionPoints.forEach(({ x, y }) => {
    let newX = x, newY = y;
    let force = 1 / (((x - CANVAS_CENTER_X) ** 2 + (y - CANVAS_CENTER_Y) ** 2) ** 0.52);
    newX -= ratio * force * (x - CANVAS_CENTER_X);
    newY -= ratio * force * (y - CANVAS_CENTER_Y);
    allPoints.push({ x: Math.floor(newX), y: Math.floor(newY), size: Math.floor(Math.random() * 2 + 1) });
  });

  // 绘制所有点
  allPoints.forEach(({ x, y, size }) => {
    context.fillStyle = HEART_COLOR;
    context.fillRect(x, y, size, size);
  });
}

// 定义一个自定义的曲线函数，用于调整爱心的跳动效果
function customCurve(p) {
  return 2 * (2 * Math.sin(4 * p)) / (2 * Math.PI);
}

// 当文档加载完成时，开始动画
document.addEventListener("DOMContentLoaded", () => {
  // 获取画布和2d上下文
  const canvas = document.getElementById("myCanvas");
  const context = canvas.getContext("2d");

  // 定义一些变量，用于控制动画
  let ratio = 0; // 力的大小比例
  let frame = 0; // 当前帧数

  // 动画函数
  function animate() {
    // 根据当前帧数计算力的大小比例
    ratio = 10 * customCurve(frame / 10 * Math.PI);
    // 调用drawHeart函数绘制爱心
    drawHeart(context, ratio, frame);
    // 增加帧数
    frame++;
    // 请求下一帧的动画
    requestAnimationFrame(animate);
  }

  // 开始动画
  animate();
});