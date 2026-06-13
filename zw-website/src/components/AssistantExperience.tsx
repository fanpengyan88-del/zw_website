"use client";

import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  Cube,
  Database,
  Keyboard,
  Microphone,
  MicrophoneSlash,
  PaperPlaneTilt,
  PhoneDisconnect,
  ShieldCheck,
  Sparkle,
  SpeakerHigh,
  SpeakerSlash,
  UserFocus,
  X,
} from "@phosphor-icons/react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import styles from "./AssistantExperience.module.css";

type AssistantState = "idle" | "listening" | "thinking" | "speaking";

const stateLabels: Record<AssistantState, string> = {
  idle: "待命",
  listening: "正在聆听",
  thinking: "正在思考",
  speaking: "正在回答",
};

type RecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: RecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type RecognitionEventLike = {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
      isFinal: boolean;
    };
    length: number;
  };
};

const prompts = [
  { icon: Buildings, label: "介绍中网华信" },
  { icon: Cube, label: "介绍产品体系" },
  { icon: ShieldCheck, label: "了解安全能力" },
  { icon: Database, label: "了解数据治理" },
  { icon: UserFocus, label: "联系方案顾问" },
];

const responses = {
  company:
    "中网华信科技股份有限公司成立于 2002 年，证券代码 870298，是一家面向政企客户的数字技术服务商。公司现有员工 200 余人，拥有自主知识产权、专利和企业资质 300 余项，形成了大数据管控、行业算法、安全应用和智能互联等核心能力。中网华信长期聚焦人工智能、数据治理、信息安全与数字化转型，为党政、校园、工业和公共安全等领域提供产品、解决方案与持续运营服务。",
  products:
    "中网华信目前形成了覆盖人工智能、业务应用、数据能力和安全防护的产品体系。主要产品包括：音频智能分析告警系统，可实时识别风险声音并分级告警；视频图像早期火灾报警系统，可通过图像智能识别烟雾与火焰；安全保密套件管理系统，用于终端、服务器和外设的统一安全管控；中网校园智慧安全守护平台，服务校园消防、防欺凌和危险行为预警；中网数字化转型能力平台，以业务、数据、人工智能和安全四大中台支撑组织持续运营；人工智能办公大模型应用平台，融合多模型、知识库与工作流；中网鉴图神探系统，提供人脸比对、以图搜图和智能图像分析。这些产品可根据党政、校园、工业和公共安全等场景进行组合与定制。",
  security:
    "中网华信提供覆盖规划、建设与运营的安全能力，包括网络安全、数据安全、密码应用、信创适配和安全运营。我们会结合客户现状，形成可持续演进的一体化防护体系。",
  data:
    "我们的数据治理服务覆盖数据标准、质量、资产、目录、安全和应用。通过统一的数据能力平台，帮助组织打通数据、明确权责，并让数据真正进入业务决策。",
  contact:
    "好的，我可以帮您进入方案沟通流程。您可以返回官网填写联系信息，也可以拨打 0351-8330236，与方案顾问直接沟通。",
  general:
    "我可以为你介绍中网华信的安全能力、数据治理、AI 应用与行业解决方案。你也可以告诉我所在行业和当前问题，我会给出更有针对性的建议。",
};

function chooseResponse(question: string) {
  if (/中网华信|中网公司|你们公司|公司介绍|介绍公司|介绍一下公司/.test(question)) return responses.company;
  if (/产品|产品体系|产品介绍|有哪些产品|你们卖什么/.test(question)) return responses.products;
  if (/联系|顾问|电话|预约/.test(question)) return responses.contact;
  if (/数据|治理|资产|中台/.test(question)) return responses.data;
  if (/安全|防护|密码|信创/.test(question)) return responses.security;
  return responses.general;
}

function ParticleHalo({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvas = canvasElement;
    const contextValue = canvas.getContext("2d");
    if (!contextValue) return;
    const context = contextValue;
    const particles = Array.from({ length: 72 }, (_, index) => ({
      angle: (index / 72) * Math.PI * 2,
      orbit: 74 + (index % 6) * 15,
      speed: .0017 + (index % 7) * .00042,
      size: .7 + (index % 4) * .42,
      offset: (index % 9) * .17,
    }));
    let frame = 0;
    let animationFrame = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const cx = width / 2;
      const cy = height * .47;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        const energy = active ? 1.8 : 1;
        const angle = particle.angle + frame * particle.speed * energy;
        const orbitX = particle.orbit * 1.42;
        const orbitY = particle.orbit * .72;
        const x = cx + Math.cos(angle) * orbitX;
        const y = cy + Math.sin(angle) * orbitY;
        const pulse = .45 + Math.sin(frame * .025 + particle.offset) * .28;
        context.beginPath();
        context.arc(x, y, particle.size * (active ? 1.22 : 1), 0, Math.PI * 2);
        context.fillStyle = index % 4 === 0
          ? `rgba(239,55,61,${.45 + pulse * .45})`
          : `rgba(159,188,217,${.12 + pulse * .25})`;
        context.fill();
      });

      frame += 1;
      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas ref={canvasRef} className={styles.particleHalo} aria-hidden="true" />;
}

type AssistantExperienceProps = {
  onClose?: () => void;
  overlay?: boolean;
};

export function AssistantExperience({ onClose, overlay = false }: AssistantExperienceProps) {
  const [state, setState] = useState<AssistantState>("idle");
  const [muted, setMuted] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [input, setInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const [mascotActive, setMascotActive] = useState(false);
  const [mascotAwake, setMascotAwake] = useState(false);
  const [statusMessage, setStatusMessage] = useState("点击开始对话");
  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamBodyRef = useRef<HTMLDivElement | null>(null);

  const stopAudio = useCallback(() => {
    window.speechSynthesis?.cancel();
    setState((current) => (current === "speaking" ? "idle" : current));
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (muted || !("speechSynthesis" in window)) {
        setState("idle");
        setStatusMessage("回答已显示");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis
        .getVoices()
        .find((item) => /^zh(-|_)/i.test(item.lang));
      if (voice) utterance.voice = voice;
      utterance.lang = "zh-CN";
      utterance.rate = 0.96;
      utterance.pitch = 1.02;
      utterance.onstart = () => {
        setState("speaking");
        setStatusMessage("中微子正在回答");
      };
      utterance.onend = () => {
        setState("idle");
        setStatusMessage("可以继续提问");
      };
      utterance.onerror = () => {
        setState("idle");
        setStatusMessage("回答已显示");
      };
      window.speechSynthesis.speak(utterance);
    },
    [muted],
  );

  const answerQuestion = useCallback(
    (question: string) => {
      const cleanQuestion = question.trim();
      if (!cleanQuestion) return;
      setKeyboardOpen(false);
      recognitionRef.current?.abort();
      setTranscript(cleanQuestion);
      setState("thinking");
      setStatusMessage("正在理解你的问题");
      if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
      thinkingTimer.current = setTimeout(() => {
        const nextAnswer = chooseResponse(cleanQuestion);
        setAnswer(nextAnswer);
        speak(nextAnswer);
      }, 760);
    },
    [speak],
  );

  useEffect(() => {
    if (overlay) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose?.();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        recognitionRef.current?.abort();
        if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
        window.speechSynthesis?.cancel();
      };
    }

    return () => {
      recognitionRef.current?.abort();
      if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
      window.speechSynthesis?.cancel();
    };
  }, [onClose, overlay]);

  useEffect(() => {
    if (!answer) {
      setStreamedAnswer("");
      return;
    }
    let index = 0;
    setStreamedAnswer("");
    const timer = window.setInterval(() => {
      index = Math.min(index + 2, answer.length);
      setStreamedAnswer(answer.slice(0, index));
      if (index >= answer.length) window.clearInterval(timer);
    }, 24);
    return () => window.clearInterval(timer);
  }, [answer]);

  useEffect(() => {
    const streamBody = streamBodyRef.current;
    if (!streamBody) return;
    const frame = window.requestAnimationFrame(() => {
      streamBody.scrollTop = streamBody.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [streamedAnswer, transcript, state]);

  async function startListening() {
    stopAudio();
    setKeyboardOpen(false);
    const browserWindow = window as typeof window & {
      SpeechRecognition?: new () => RecognitionInstance;
      webkitSpeechRecognition?: new () => RecognitionInstance;
    };
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setKeyboardOpen(true);
      setStatusMessage("当前浏览器暂不支持语音识别，请输入文字");
      return;
    }

    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setKeyboardOpen(true);
      setStatusMessage("语音识别需要 HTTPS，请先使用文字输入");
      return;
    }

    const recognition = new Recognition();
    let hasUsableResult = false;
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => {
      setKeyboardOpen(false);
      setAnswer("");
      setTranscript("");
      setState("listening");
      setStatusMessage("我正在听，请说...");
    };
    recognition.onresult = (event) => {
      let text = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        text += event.results[index][0].transcript;
      }
      setTranscript(text);
      if (text.trim()) hasUsableResult = true;
      if (event.results[event.results.length - 1].isFinal) {
        setKeyboardOpen(false);
        answerQuestion(text);
      }
    };
    recognition.onerror = (event) => {
      if (event.error === "aborted" || hasUsableResult) {
        setKeyboardOpen(false);
        return;
      }
      setState("idle");
      if (event.error === "not-allowed") {
        setKeyboardOpen(true);
        setStatusMessage("麦克风权限未开启，请允许访问或输入文字");
      } else if (event.error === "no-speech") {
        setStatusMessage("没有听清，请再试一次");
      } else {
        setKeyboardOpen(true);
        setStatusMessage("语音服务暂不可用，请输入文字");
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setState((current) => (current === "listening" ? "idle" : current));
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setState("idle");
    setStatusMessage("已停止聆听");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    answerQuestion(input);
    setInput("");
    setKeyboardOpen(false);
  }

  function endSession() {
    recognitionRef.current?.abort();
    stopAudio();
    setTranscript("");
    setAnswer("");
    setKeyboardOpen(false);
    setState("idle");
    setStatusMessage("点击开始对话");
    if (overlay) onClose?.();
  }

  function activateMascot() {
    setMascotAwake(true);
    setMascotActive(true);
    setStatusMessage("中微子已唤醒，可以开始对话");
    window.setTimeout(() => setMascotActive(false), 1500);
    if (!muted && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const greeting = new SpeechSynthesisUtterance("您好，我是中微子。很高兴为您服务。");
      greeting.lang = "zh-CN";
      greeting.rate = .98;
      window.speechSynthesis.speak(greeting);
    }
  }

  return (
    <>
      {overlay && <button type="button" className={styles.backdrop} onClick={onClose} aria-label="关闭中微子助手" />}
      <main
        className={`${styles.page} ${overlay ? styles.overlay : ""}`}
        role={overlay ? "dialog" : undefined}
        aria-modal={overlay || undefined}
        aria-label={overlay ? "中微子沉浸式语音助手" : undefined}
      >
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.flowLines} aria-hidden="true"><i /><i /><i /><i /></div>

      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={onClose} aria-label="返回中网华信官网">
          <img src="/media/brand/zw-logo.svg" alt="" />
          <span>中微子</span>
          <i />
          <small>安全大数据 · 智慧应用</small>
        </button>
        <div className={styles.privacy}>
          <span />
          隐私模式已开启
          <ShieldCheck weight="duotone" />
        </div>
      </header>

      <button type="button" className={styles.backLink} onClick={onClose}>
        <ArrowLeft />
        关闭助手
      </button>

      <section className={styles.stage} aria-live="polite">
        <div className={styles.experienceGrid}>
          <div className={`${styles.mascotZone} ${mascotActive ? styles.mascotActive : ""} ${mascotAwake ? styles.mascotAwake : ""}`}>
            <ParticleHalo active={mascotAwake || state !== "idle"} />
            <button type="button" className={styles.mascotButton} onClick={activateMascot} aria-label="点击唤醒中微子">
              <span className={styles.mascotPulse} />
              <img src="/media/brand/xiaowang-transparent.png" alt="中微子智能助手形象" />
            </button>
            <div className={styles.mascotPrompt}>
              <Sparkle weight="fill" />
              <span>{mascotAwake ? "中微子在线 · 智能交互已就绪" : "点击中微子 · 激活智能交互"}</span>
            </div>
          </div>

          <div className={styles.voiceZone}>
            <div className={`${styles.streamPanel} ${styles[state]}`}>
              <div className={styles.streamHeader}>
                <span><i /> 中微子智能响应流</span>
                <small>{stateLabels[state]} / 02 毫秒</small>
              </div>
              <div ref={streamBodyRef} className={styles.streamBody}>
                {!transcript && !answer && (
                  <div className={styles.streamWelcome}>
                    <h1>您好，我是中微子</h1>
                    <p>你可以通过语音或文字，了解中网华信的公司情况、产品能力与解决方案。</p>
                  </div>
                )}
                {transcript && (
                  <div className={styles.userStream}>
                    <small>YOUR REQUEST</small>
                    <p>{transcript}</p>
                  </div>
                )}
                {state === "thinking" && (
                  <div className={styles.thinkingStream}>
                    <i /><i /><i />
                    <span>正在检索企业知识库</span>
                  </div>
                )}
                {answer && (
                  <div className={styles.answerStream}>
                    <small>中微子 / 智能回答</small>
                    <p>{streamedAnswer}<b className={styles.streamCursor} /></p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.liveStatus} ${state !== "idle" ? styles.activeStatus : ""}`}>
              <span className={styles.wave} aria-hidden="true">
                {Array.from({ length: 26 }, (_, index) => <i key={index} />)}
              </span>
              <p><b />{statusMessage}<b /></p>
            </div>

            <div className={styles.controls}>
              <button
                type="button"
                onClick={() => setMuted((value) => !value)}
                aria-label={muted ? "打开语音播报" : "关闭语音播报"}
                title={muted ? "打开语音播报" : "关闭语音播报"}
              >
                {muted ? <SpeakerSlash /> : <SpeakerHigh />}
              </button>
              <button
                type="button"
                className={styles.primaryControl}
                onClick={state === "listening" ? stopListening : startListening}
                disabled={state === "thinking"}
                aria-label={state === "listening" ? "停止聆听" : "开始语音对话"}
              >
                {state === "listening" ? <MicrophoneSlash weight="fill" /> : <Microphone weight="fill" />}
                <span />
              </button>
              <button
                type="button"
                onClick={() => setKeyboardOpen((value) => !value)}
                aria-label="使用键盘输入"
                title="使用键盘输入"
              >
                <Keyboard />
              </button>
              <button type="button" onClick={endSession} aria-label="结束当前会话" title="结束当前会话">
                <PhoneDisconnect weight="fill" />
              </button>
            </div>
          </div>
        </div>

        {keyboardOpen && (
          <form className={styles.inputPanel} onSubmit={handleSubmit}>
            <label htmlFor="assistant-question">输入你的问题</label>
            <div>
              <input
                id="assistant-question"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="例如：你们能提供哪些数据安全服务？"
                autoFocus
              />
              <button type="submit" disabled={!input.trim()} aria-label="发送问题">
                <PaperPlaneTilt weight="fill" />
              </button>
              <button type="button" onClick={() => setKeyboardOpen(false)} aria-label="关闭输入框">
                <X />
              </button>
            </div>
          </form>
        )}
      </section>

      <nav className={styles.suggestions} aria-label="推荐问题">
        {prompts.map(({ icon: Icon, label }) => (
          <button type="button" key={label} onClick={() => answerQuestion(label)}>
            <Icon weight="duotone" />
            <span>{label}</span>
            <ArrowRight />
          </button>
        ))}
      </nav>
      </main>
    </>
  );
}
