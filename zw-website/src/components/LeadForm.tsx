"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "提交失败");
      setState("success");
      setMessage("需求已收到，我们会尽快与您联系。");
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "提交失败，请拨打服务热线。");
    }
  }

  return (
    <form className={`lead-form ${compact ? "compact" : ""}`} onSubmit={submit}>
      <label className="form-honeypot" aria-hidden="true">
        网站
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-grid">
        <label>姓名<input name="name" maxLength={30} required placeholder="怎么称呼您" /></label>
        <label>单位<input name="company" maxLength={80} required placeholder="单位名称" /></label>
        <label>电话<input name="phone" inputMode="tel" required placeholder="手机号或座机" /></label>
        <label>需求方向
          <select name="interest" required defaultValue="">
            <option value="" disabled>请选择</option>
            <option>AI与大模型</option><option>数据治理</option><option>信息安全</option>
            <option>数字化转型</option><option>校园安全</option><option>其他</option>
          </select>
        </label>
      </div>
      {!compact && <label>需求说明<textarea name="message" maxLength={500} rows={4} placeholder="请简要描述您的业务场景" /></label>}
      <label className="privacy"><input name="privacy" type="checkbox" value="accepted" required /> 我已阅读并同意仅将以上信息用于本次商务联系</label>
      <button className="button primary" disabled={state === "submitting"}>{state === "submitting" ? "正在提交…" : "提交咨询"}</button>
      {message && <p className={`form-message ${state}`} role="status">{message}</p>}
    </form>
  );
}
