"use client";
import React, { useEffect, useRef } from "react";

const bgUrl = "/background.jpg";      // 页面总背景
const popupBgUrl = "/popup.jpg";      // 弹窗背景
const audioUrl = "/1.mp3";            // 音频

const messages = [
  "聿，我们现在，算真夫妻了吗？",
  "遗憾的不是你不爱我，而是我再也不能爱你。",
  "我这个人，比较擅长在荒芜中种植希望。",
  "我永远不想错过你。",
  "记忆太浅，可你还是叫了我的名字，叫我羌青瓷。",
  "我真的喜欢你很长时间了，比一根火柴要长，比十年也要长。",
  "恨比爱长久。",
  "我的承诺、我的爱，不需要成为你的负担。",
  "鲨鱼的安魂曲，永远为你回荡。",
  "聿，我的密码都是一样的。",
  "所以，亲爱的，纯恨情侣，怎么不算情侣？",
  "第三根，消除记忆。",
  "你真的要剖开我的心吗。",
  "我早就看见你了。",
  "第三根火柴燃尽之际，天光地，黄昏的火烧云下如同野火。",
  "这般凉薄的人，唇竟也是热的。",
  "所以…对不起…这一次，我还是不忘了。",
  "天杀的，你比我更像我。",
  "可是聿，我们之间十年的过往，竟比一根火柴的时间还要短暂。",
  "炙红的弧斑花铺天盖地，黄昏的火烧云下如同野火。",
  "孤挺花的花语是：喋喋不休。",
  "火光之下，字字真心。",
  "钱都给你，命是赠品。",
  "第二根，进入催眠。",
  "我们同登彼岸。",
  "我的十分真心，被你当作的三分假意，都将随着这根火柴燃尽，而云散烟消。",
  "这些记忆太过渺小，可你依旧是唯一。",
  "如果奇迹照拂你，让我做第一个为你鼓掌的人。",
  "聿，你看见我了吗？"
];

const POPUP_MIN_WIDTH = 180;
const POPUP_MAX_WIDTH = 260;
const POPUP_HEIGHT = 56;
const MAX_POPUPS = 700;

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const popupsRef = useRef<any[]>([]);
  const animationRef = useRef<number>(null);
  const timerRef = useRef<number>(null);

  useEffect(() => {
    const audio = document.getElementById("bgMusic") as HTMLAudioElement | null;
    if (audio) {
      audio.volume = 0.26;
      audio.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 预加载总背景和弹窗背景图片
    const bgImg = new window.Image();
    bgImg.src = bgUrl;
    const popupImg = new window.Image();
    popupImg.src = popupBgUrl;

    // 渲染动画
    function render() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 画背景
      if (bgImg.complete && bgImg.width && bgImg.height) {
        ctx.globalAlpha = 1;
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#030a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      popupsRef.current.forEach((popup) => {
        ctx.save();
        ctx.translate(popup.x, popup.y);
        ctx.rotate((popup.angle * Math.PI) / 180);
        ctx.globalAlpha = 0.98;
        // 圆角裁剪
        ctx.save();
        drawRoundRect(ctx, 0, 0, popup.width, POPUP_HEIGHT, 18);
        ctx.clip();

        // 裁切 popup.jpg，比例无压缩
        if (popupImg.complete && popupImg.width && popupImg.height) {
          const imgAspect = popupImg.width / popupImg.height;
          const popupAspect = popup.width / POPUP_HEIGHT;
          let sx = 0, sy = 0, sWidth = popupImg.width, sHeight = popupImg.height;
          if (imgAspect > popupAspect) {
            sWidth = popupImg.height * popupAspect;
            sx = (popupImg.width - sWidth) / 2;
          } else {
            sHeight = popupImg.width / popupAspect;
            sy = (popupImg.height - sHeight) / 2;
          }
          ctx.drawImage(
            popupImg, sx, sy, sWidth, sHeight,
            0, 0, popup.width, POPUP_HEIGHT
          );
        } else {
          ctx.fillStyle = "rgba(38,58,86, 0.86)";
          ctx.fillRect(0, 0, popup.width, POPUP_HEIGHT);
        }
        ctx.restore();

        // 文字+阴影
        ctx.shadowColor = "rgba(0,0,0,0.50)";
        ctx.shadowBlur = 8;
        ctx.font = "600 20px 'PingFang SC','Inter','Helvetica Neue',Arial,sans-serif";
        ctx.fillStyle = "#edf4ff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          popup.msg,
          popup.width / 2,
          POPUP_HEIGHT / 2 + 2,
          popup.width - 32
        );
        ctx.restore();
      });

      animationRef.current = window.requestAnimationFrame(render);
    }
    render();

    // ========== 动态加速弹窗定时器 ==========
    let interval = 1200;      // 初始弹窗间隔
    const minInterval = 120;  // 最快弹窗间隔
    const decay = 0.97;       // 加速倍率，自己可调（越接近1加速越慢）

    function bomb() {
      if (!canvas) return;
      if (popupsRef.current.length > MAX_POPUPS) popupsRef.current.shift();

      const width = Math.floor(
        POPUP_MIN_WIDTH + Math.random() * (POPUP_MAX_WIDTH - POPUP_MIN_WIDTH)
      );
      const x = Math.random() * (canvas.width - width - 10);
      const y = Math.random() * (canvas.height - POPUP_HEIGHT - 10);
      const angle = Math.random() * 36 - 18;
      const msg = messages[Math.floor(Math.random() * messages.length)];
      popupsRef.current.push({ x, y, width, angle, msg });

      interval = Math.max(minInterval, interval * decay);
      timerRef.current = window.setTimeout(bomb, interval);
    }

    // 启动弹窗轰炸
    bomb();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <audio id="bgMusic" loop autoPlay src={audioUrl} />
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      />
    </div>
  );
}
