"use client";

import {
  ArrowRight,
  ChatCircleDots,
  Microphone,
  MicrophoneSlash,
  Pause,
  Play,
  SpeakerHigh,
  Sparkle,
  Stop,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const welcome = "您好呀，我是小网，有什么可以帮助您的呢？";
const acknowledgement = "好的，收到。";

const companyIntroduction = [
  "中网华信科技股份有限公司成立于2002年，是山西省新三板创新层企业。公司以成为领先、可信赖的数字技术服务商为愿景，致力于为安全开放的数字经济生态塑造新动能、注入新活力。",
  "企业总人数200余人，本科以上学历占比70%以上，平均年龄31岁。现有自主知识产权、专利和企业资质300余项，取得涉密双甲证书10年以上，并通过CCRC安全服务、两化融合AA级、CMMI5级、DCMM3级、ITSS3级、数据产品开发服务商等行业体系认证。",
  "公司已形成大数据管控、行业算法、安全应用、智能互联等20余项核心专利技术和标准，获批山西省数字化转型促进中心、专精特新小巨人企业、省级技术中心、高新技术企业，以及省市重点产业链“链核”企业。",
];

const capabilities = [
  {
    title: "AI技术创新引领",
    text: "以深度学习为底层支撑，整合语音识别、行为分析、自然语言处理，并结合垂类大模型形成多模态AI体系。通过行业化算法模型，实现复杂数据的智能解析与决策支撑，为政务、工业等领域提供精准化、智能化赋能。",
  },
  {
    title: "浸入式安全体系",
    text: "融合密码、信创、区块链等技术，构建多层次协同安全架构，覆盖数据全生命周期防护，提供从底层技术到应用层的一站式数字化安全运营解决方案。公司信创业务已实现山西省内全覆盖。",
  },
  {
    title: "全融合数字底座",
    text: "基于中网数字能力平台，打破信息壁垒，实现跨领域数据互联互通与高效协同，构建支撑多行业数字化运营的统一技术基座，专业、高效地服务多家行业客户。",
  },
  {
    title: "价值化数据服务",
    text: "以数据科学治理为核心，融合人工智能、大数据等技术，构建安全可控的数据应用体系，聚焦政务、工业、低空、文旅等场景，实现数据价值的深度挖掘与场景化落地，为业务创新提供精准支撑。",
  },
];

const closing =
  "高效、诚信、担当、创新、利他，是中网人的核心价值观。中网精研核心技术、深耕创新应用，以价值创造理念打造数智化运营体系，始终致力于创新与卓越，引领行业，成就未来！";

const speechSegments = [
  acknowledgement,
  ...companyIntroduction,
  "中网公司拥有四大核心技术能力。",
  ...capabilities.flatMap((item) => [item.title, item.text]),
  closing,
];

const shortcuts = [
  { label: "产品能力", detail: "AI、数据与安全平台", target: "products" },
  { label: "行业方案", detail: "查看数字化应用场景", target: "solutions" },
  { label: "联系专家", detail: "获取专属方案建议", target: "contact" },
];

type XiaowangGuideProps = {
  onNavigate: (target: string) => void;
};

export function XiaowangGuide({ onNavigate }: XiaowangGuideProps) {
  const [open, setOpen] = useState(false);
  const [awake, setAwake] = useState(false);
  const [turning, setTurning] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("点击麦克风，直接和小网说话");
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnVideoRef = useRef<HTMLVideoElement | null>(null);
  const hasWelcomed = useRef(false);
  const speechSession = useRef(0);
  const recognitionRef = useRef<{
    start: () => void;
    stop: () => void;
    abort: () => void;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function getChineseVoice() {
    return window.speechSynthesis
      ?.getVoices()
      .find((voice) => /^zh(-|_)/i.test(voice.lang));
  }

  function speak(content: string | string[]) {
    if (!("speechSynthesis" in window)) return;

    const session = ++speechSession.current;
    const segments = Array.isArray(content) ? content : [content];
    window.speechSynthesis.cancel();
    const voice = getChineseVoice();
    let segmentIndex = 0;

    setSpeaking(true);
    setPaused(false);

    function playNext() {
      if (speechSession.current !== session) return;
      if (segmentIndex >= segments.length) {
        setSpeaking(false);
        setPaused(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(segments[segmentIndex]);
      segmentIndex += 1;
      if (voice) utterance.voice = voice;
      utterance.lang = "zh-CN";
      utterance.rate = 0.96;
      utterance.pitch = 1.08;
      utterance.volume = 1;
      utterance.onend = playNext;
      utterance.onerror = (event) => {
        if (event.error === "interrupted" || event.error === "canceled") return;
        setSpeaking(false);
        setPaused(false);
      };
      window.speechSynthesis.speak(utterance);
    }

    window.setTimeout(playNext, 0);
  }

  function wakeUp() {
    setAwake(true);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      if (!hasWelcomed.current) {
        hasWelcomed.current = true;
        speak(welcome);
      }
    }, 420);
  }

  function rest() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setAwake(false);
  }

  function openGuide() {
    setOpen(true);
    setAwake(false);
    if (!speaking) {
      speak(welcome);
    }
    hasWelcomed.current = true;
  }

  function handleLauncherClick() {
    if (open) {
      closeGuide();
      return;
    }

    if (turning) return;

    const video = turnVideoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      openGuide();
      return;
    }

    setAwake(false);
    setTurning(true);
    video.currentTime = 0;
    void video.play().catch(() => {
      setTurning(false);
      openGuide();
    });
  }

  function finishTurn() {
    if (!turning) return;
    setTurning(false);
    openGuide();
  }

  function answerCompanyQuestion() {
    setAnswered(true);
    speak(speechSegments);
  }

  function handleVoiceQuestion(question: string) {
    const normalized = question.replace(/[，。！？、\s]/g, "");
    if (
      normalized.includes("介绍中网") ||
      normalized.includes("介绍一下中网") ||
      normalized.includes("中网华信") ||
      normalized.includes("中网公司")
    ) {
      setVoiceMessage("已识别你的问题");
      answerCompanyQuestion();
      return;
    }

    setVoiceMessage("这个问题我还在学习中，可以先问我“介绍一下中网华信”");
    speak("这个问题我还在学习中。你可以先问我，介绍一下中网华信。");
  }

  async function startListening() {
    if (!window.isSecureContext) {
      setVoiceMessage("当前页面不是安全连接，请使用受信任的 HTTPS 地址访问");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceMessage("当前浏览器无法访问麦克风，请使用最新版 Edge 或 Chrome");
      return;
    }

    const SpeechRecognition =
      (window as typeof window & { SpeechRecognition?: new () => any }).SpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage("当前浏览器不支持语音识别，请使用最新版 Edge 或 Chrome");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      const errorName = error instanceof DOMException ? error.name : "";
      if (errorName === "NotAllowedError" || errorName === "SecurityError") {
        setVoiceMessage("麦克风权限被阻止，请在地址栏左侧的网站权限中选择“允许”");
      } else if (errorName === "NotFoundError") {
        setVoiceMessage("没有检测到麦克风，请检查设备连接和 Windows 输入设备设置");
      } else if (errorName === "NotReadableError") {
        setVoiceMessage("麦克风正被其他程序占用，请关闭占用程序后重试");
      } else {
        setVoiceMessage("无法启用麦克风，请检查浏览器和系统权限");
      }
      return;
    }

    stopSpeech();
    recognitionRef.current?.abort();

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
      setVoiceMessage("我在听，请说话…");
    };
    recognition.onresult = (event: any) => {
      let text = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        text += event.results[index][0].transcript;
      }
      setTranscript(text);
      if (event.results[event.results.length - 1].isFinal) {
        handleVoiceQuestion(text);
      }
    };
    recognition.onerror = (event: any) => {
      setListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setVoiceMessage("需要允许麦克风权限，小网才能听见你");
      } else if (event.error === "no-speech") {
        setVoiceMessage("没有听清，请靠近麦克风再试一次");
      } else {
        setVoiceMessage("语音识别暂时不可用，请稍后再试");
      }
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function toggleSpeech() {
    if (!speaking) {
      speak(answered ? speechSegments : welcome);
      return;
    }

    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function stopSpeech() {
    speechSession.current += 1;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
  }

  function closeGuide() {
    stopSpeech();
    setOpen(false);
  }

  function navigate(target: string) {
    stopSpeech();
    onNavigate(target);
    setOpen(false);
  }

  return (
    <aside
      className={`xiaowang-guide ${open ? "is-open" : ""} ${awake ? "is-awake" : ""} ${turning ? "is-turning" : ""}`}
      aria-label="小网智能向导"
    >
      {!open && awake && (
        <div className="xiaowang-hover-greeting" role="status">
          <Sparkle weight="fill" />
          <p>{welcome}</p>
        </div>
      )}

      {open && (
        <div className={`xiaowang-panel ${answered ? "has-answer" : ""}`}>
          <div className="xiaowang-panel-head">
            <div className="xiaowang-identity">
              <span className="xiaowang-mini-avatar">
                <img src="/media/brand/xiaowang-transparent.png" alt="" />
              </span>
              <span>
                <b>小网</b>
                <small><i /> 智能向导在线</small>
              </span>
            </div>
            <div className="xiaowang-head-actions">
              <button onClick={toggleSpeech} aria-label={paused ? "继续播报" : speaking ? "暂停播报" : "语音播报"}>
                {speaking && !paused ? <Pause weight="fill" /> : <SpeakerHigh weight="fill" />}
              </button>
              {speaking && (
                <button onClick={stopSpeech} aria-label="停止播报"><Stop weight="fill" /></button>
              )}
              <button onClick={closeGuide} aria-label="关闭小网助手"><X /></button>
            </div>
          </div>

          <div className="xiaowang-chat">
            <div className="xiaowang-welcome">
              <span className="xiaowang-answer-avatar">
                <img src="/media/brand/xiaowang-transparent.png" alt="" />
              </span>
              <div>
                <p>{welcome}</p>
                <small>你可以点击下面的问题，我会为你介绍。</small>
              </div>
            </div>

            <div className="xiaowang-question-list">
              <button onClick={answerCompanyQuestion} className={answered ? "active" : ""}>
                <span><ChatCircleDots weight="fill" />介绍一下中网华信</span>
                <ArrowRight />
              </button>
            </div>

            <div className={`xiaowang-voice ${listening ? "is-listening" : ""}`}>
              <button
                className="xiaowang-mic"
                onClick={listening ? stopListening : startListening}
                aria-label={listening ? "停止聆听" : "开始语音对话"}
              >
                {listening ? <MicrophoneSlash weight="fill" /> : <Microphone weight="fill" />}
                <span className="xiaowang-mic-ring" />
              </button>
              <div>
                <b>{listening ? "正在聆听" : "语音问小网"}</b>
                <p>{transcript || voiceMessage}</p>
              </div>
              <span className="xiaowang-wave" aria-hidden="true">
                <i /><i /><i /><i /><i />
              </span>
            </div>

            {answered && (
              <div className="xiaowang-answer" aria-live="polite">
                <div className="xiaowang-answer-status">
                  <span><i /> {speaking ? paused ? "播报已暂停" : "小网正在为你讲解" : "回答已就绪"}</span>
                  <button onClick={() => speak(speechSegments)}>
                    <Play weight="fill" /> 重新播报
                  </button>
                </div>
                <strong>{acknowledgement}</strong>
                {companyIntroduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <h4>中网公司四大核心技术能力</h4>
                <div className="xiaowang-capabilities">
                  {capabilities.map((item, index) => (
                    <article key={item.title}>
                      <span>0{index + 1}</span>
                      <div><b>{item.title}</b><p>{item.text}</p></div>
                    </article>
                  ))}
                </div>
                <p className="xiaowang-closing">{closing}</p>
              </div>
            )}

            {!answered && (
              <div className="xiaowang-shortcuts">
                {shortcuts.map((item) => (
                  <button key={item.target} onClick={() => navigate(item.target)}>
                    <span><b>{item.label}</b><small>{item.detail}</small></span>
                    <ArrowRight />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        className="xiaowang-launcher"
        onMouseEnter={wakeUp}
        onMouseLeave={rest}
        onFocus={wakeUp}
        onBlur={rest}
        onClick={handleLauncherClick}
        aria-expanded={open}
        aria-busy={turning}
        aria-label={open ? "关闭小网助手" : "打开小网助手"}
      >
        <span className="xiaowang-spark spark-one"><Sparkle weight="fill" /></span>
        <span className="xiaowang-spark spark-two"><Sparkle weight="fill" /></span>
        <span className="xiaowang-spark spark-three"><Sparkle weight="fill" /></span>
        <span className="xiaowang-launcher-image">
          <img src="/media/brand/xiaowang-transparent.png" alt="" />
          <video
            ref={turnVideoRef}
            src="/media/brand/xiaowang-turn.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={finishTurn}
            onError={finishTurn}
            aria-hidden="true"
          />
        </span>
        <span className="xiaowang-status"><ChatCircleDots weight="fill" /></span>
      </button>
    </aside>
  );
}
