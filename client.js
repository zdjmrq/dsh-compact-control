window.__ModuleLoader__.load({id:"dsh-compact-control",factory:(require)=>{var module={exports:{}};var exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  ControlCard: () => ControlCard,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = __toESM(require("react"), 1);
var inject = ["slots", "configForms"];
function apply(ctx) {
  const scope = ctx.configForms.get("compact-control");
  ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
    name: "plugins.bundle.config",
    key: "dsh-compact-control"
  }, ({ view } = {}) => view === "summary" ? "\u6309\u767E\u5206\u6BD4\u8C03\u6574\u81EA\u52A8 Compact \u7684\u89E6\u53D1\u9608\u503C\u3002" : /* @__PURE__ */ import_react.default.createElement(ControlCard, { scope })));
}
var css = `
.dcc-card{color:var(--dsw-alias-label-primary,inherit);border:1px solid var(--dsw-alias-border-l3,#8885);border-radius:16px;background:var(--dsw-alias-bg-module-platform,transparent);overflow:hidden;font-size:14px}
.dcc-card summary{cursor:pointer;list-style:none;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}.dcc-card summary::-webkit-details-marker{display:none}
.dcc-card h3{font-size:16px;margin:0 0 7px;font-weight:600}.dcc-muted{color:var(--dsw-alias-label-secondary,#888);font-size:13px;line-height:1.65;margin:0}
.dcc-chevron{transition:transform .15s}.dcc-card[open] .dcc-chevron{transform:rotate(180deg)}.dcc-body{padding:0 24px 22px}.dcc-divider{border-top:1px solid var(--dsw-alias-border-l3,#8884);padding-top:22px}
.dcc-label{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px}.dcc-percent{font-size:30px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.2}.dcc-range{width:100%;accent-color:var(--dsw-alias-state-business-primary,#3478f6);cursor:pointer;margin:0;height:24px;display:block}.dcc-range:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#3478f6);outline-offset:5px;border-radius:8px}.dcc-range:disabled{cursor:default;opacity:.5}
.dcc-scale{display:flex;justify-content:space-between;font-size:12px;color:var(--dsw-alias-label-tertiary,#888);margin:7px 0 15px}.dcc-note{margin-top:18px;padding:13px 16px;border-radius:10px;background:var(--dsw-alias-bg-module-secondary,#8881)}
.dcc-footer{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:22px}.dcc-button{font:inherit;border:1px solid var(--dsw-alias-border-l3,#8885);border-radius:9px;padding:8px 14px;cursor:pointer;color:inherit;background:transparent}.dcc-button:disabled{cursor:default;opacity:.45}.dcc-button-primary{background:var(--dsw-alias-state-business-primary,#3478f6);border-color:transparent;color:white}.dcc-status{font-size:12px;color:var(--dsw-alias-label-secondary,#888);margin-left:auto}.dcc-error{color:var(--dsw-alias-state-error-primary,#e55353);margin-top:12px}
@media(max-width:480px){.dcc-card summary{padding:18px}.dcc-body{padding:0 18px 18px}.dcc-status{width:100%;margin-left:0}}
`;
function ControlCard({ scope }) {
  const snapshot = (0, import_react.useSyncExternalStore)((cb) => scope.subscribe(cb), () => scope.getSnapshot());
  const accepted = snapshot.value?.thresholdPercent ?? 80;
  const [percent, setPercent] = (0, import_react.useState)(accepted);
  const [saving, setSaving] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  const [saved, setSaved] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setPercent(accepted);
    setSaved(false);
  }, [accepted]);
  const writable = snapshot.status === "ready" && snapshot.writable;
  const dirty = percent !== accepted;
  async function save(value = percent) {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const ok = await scope.mutate([{ op: "set", path: ["thresholdPercent"], value }], snapshot.revision);
      if (!ok) throw new Error("\u4FDD\u5B58\u672A\u6210\u529F\uFF0C\u8BBE\u7F6E\u53EF\u80FD\u5DF2\u5728\u5176\u4ED6\u7A97\u53E3\u53D8\u66F4\uFF0C\u8BF7\u91CD\u8BD5\u3002");
      setPercent(value);
      setSaved(true);
    } catch (e) {
      setError(e.message || "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ import_react.default.createElement("details", { className: "dcc-card", open: true }, /* @__PURE__ */ import_react.default.createElement("style", null, css), /* @__PURE__ */ import_react.default.createElement("summary", null, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h3", null, "\u81EA\u52A8\u538B\u7F29\u9608\u503C"), /* @__PURE__ */ import_react.default.createElement("p", { className: "dcc-muted" }, "\u8BBE\u7F6E\u4E0A\u4E0B\u6587\u8FBE\u5230\u6A21\u578B\u7A97\u53E3\u7684\u591A\u5C11\u767E\u5206\u6BD4\u65F6\uFF0C\u81EA\u52A8\u6267\u884C Compact\u3002")), /* @__PURE__ */ import_react.default.createElement("span", { className: "dcc-chevron", "aria-hidden": "true" }, "\u2304")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcc-body" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcc-divider" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcc-label" }, /* @__PURE__ */ import_react.default.createElement("label", { htmlFor: "dcc-threshold" }, "\u89E6\u53D1\u6BD4\u4F8B"), /* @__PURE__ */ import_react.default.createElement("output", { className: "dcc-percent", htmlFor: "dcc-threshold" }, percent, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 18 } }, " %"))), /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      id: "dcc-threshold",
      className: "dcc-range",
      type: "range",
      min: "1",
      max: "100",
      step: "1",
      value: percent,
      "aria-label": "\u81EA\u52A8\u538B\u7F29\u89E6\u53D1\u6BD4\u4F8B",
      "aria-valuetext": `${percent}%`,
      disabled: !writable || saving,
      onChange: (e) => {
        setPercent(Number(e.target.value));
        setSaved(false);
        setError("");
      }
    }
  ), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcc-scale", "aria-hidden": "true" }, /* @__PURE__ */ import_react.default.createElement("span", null, "1%"), /* @__PURE__ */ import_react.default.createElement("span", null, "50%"), /* @__PURE__ */ import_react.default.createElement("span", null, "100%")), /* @__PURE__ */ import_react.default.createElement("p", { className: "dcc-muted" }, "\u62D6\u52A8\u6ED1\u5757\uFF0C\u6216\u805A\u7126\u540E\u7528 \u2190 / \u2192 / \u2191 / \u2193 \u6BCF\u6B21\u5FAE\u8C03 1%\u3002\u9ED8\u8BA4\u503C\u4E3A 80%\u3002"), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcc-note" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "dcc-muted" }, "\u4FDD\u5B58\u540E\uFF0C\u5DF2\u63A5\u5165\u63D2\u4EF6\u7684\u4F1A\u8BDD\u4ECE\u4E0B\u4E00\u6B21\u6267\u884C\u6B65\u9AA4\u5F00\u59CB\u4F7F\u7528\u65B0\u6BD4\u4F8B\u3002\u5B9E\u9645\u89E6\u53D1\u70B9\u4ECD\u53D7\u6A21\u578B\u8F93\u51FA\u9884\u7559\u4E0E\u5B89\u5168\u4F59\u91CF\u9650\u5236\uFF0C\u53EF\u80FD\u65E9\u4E8E\u6ED1\u5757\u6BD4\u4F8B\uFF1B100% \u4E5F\u4FDD\u7559\u539F\u751F\u5BB9\u91CF\u4FDD\u62A4\u3002"), /* @__PURE__ */ import_react.default.createElement("p", { className: "dcc-muted", style: { marginTop: 8 } }, "\u8F83\u4F4E\u9608\u503C\u4F1A\u76F8\u5E94\u7F29\u5C0F\u6700\u8FD1\u5386\u53F2\u7684\u4FDD\u7559\u9884\u7B97\u3002\u8FBE\u5230\u9608\u503C\u540E\uFF0CDSH \u53EF\u80FD\u5148\u88C1\u526A\u5DE5\u5177\u7ED3\u679C\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u751F\u6210\u538B\u7F29\u6458\u8981\u3002")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcc-footer" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dcc-button dcc-button-primary", disabled: !writable || saving || !dirty, onClick: () => save() }, saving ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58\u8BBE\u7F6E"), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dcc-button", disabled: !writable || saving || percent === 80 && accepted === 80, onClick: () => save(80) }, "\u6062\u590D\u9ED8\u8BA4 80%"), /* @__PURE__ */ import_react.default.createElement("span", { className: "dcc-status", role: "status" }, snapshot.status !== "ready" ? "\u7B49\u5F85\u63D2\u4EF6\u914D\u7F6E\u52A0\u8F7D\u2026" : !snapshot.writable ? "\u5F53\u524D\u8BBE\u7F6E\u53EA\u8BFB" : saving ? "\u6B63\u5728\u4FDD\u5B58\u2026" : dirty ? "\u6709\u672A\u4FDD\u5B58\u7684\u4FEE\u6539" : saved ? "\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u4E00\u6B21\u68C0\u67E5\u751F\u6548" : `\u5F53\u524D\u5DF2\u4FDD\u5B58 ${accepted}%`)), error && /* @__PURE__ */ import_react.default.createElement("p", { className: "dcc-error", role: "alert" }, error))));
}
return module.exports;}});
