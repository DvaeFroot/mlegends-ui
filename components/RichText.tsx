import React from "react";

const SECTION_SPLIT_RE = /(?=\b(?:Unique\s+)?(?:Passive|Active)\s*:)/i;
const LABEL_EXTRACT_RE = /^((?:Unique\s+)?(?:Passive|Active))\s*:\s*/i;

export function AbilityText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const segments = text.split(SECTION_SPLIT_RE).filter(Boolean);
  if (segments.length <= 1) return <RichText text={text} style={style} />;
  return (
    <span style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {segments.map((seg, i) => {
        const labelMatch = seg.match(LABEL_EXTRACT_RE);
        if (labelMatch) {
          const label = labelMatch[1];
          const rest = seg.slice(labelMatch[0].length);
          const isPassive = /passive/i.test(label);
          return (
            <span key={i} style={{ display: "block" }}>
              <span style={{ color: isPassive ? "#8b92a8" : "#38bdf8", fontWeight: 700, fontSize: "0.8em", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: "6px", borderRadius: "3px", background: isPassive ? "#6b759322" : "#38bdf822", padding: "1px 6px", border: `1px solid ${isPassive ? "#6b759355" : "#38bdf844"}` }}>
                {label}
              </span>
              <RichText text={rest} />
            </span>
          );
        }
        return <span key={i} style={{ display: "block" }}><RichText text={seg} /></span>;
      })}
    </span>
  );
}

// Token color map:
// physical  → red     (#e05a2b) — physical attack/defense/damage/lifesteal
// magic     → blue    (#5b7ee5) — magic power/defense/damage, mana
// hp        → green   (#27ae60) — HP, heal, shield, regen
// damage    → white   (#ffffff) — damage, true damage, critical damage
// keyword   → lavender(#c084fc) — extra, bonus, stun, slow, scaling, etc.
// number    → gold    (#e8b84b) — numbers and percentages
export function RichText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const tokens = tokenize(text);
  return (
    <span style={style}>
      {tokens.map((t, i) => {
        switch (t.type) {
          case "physical": return <span key={i} style={{ color: "#e05a2b", fontWeight: 600 }} data-tip="Physical — scales with Physical Attack or Defense. Reduced by enemy Physical Defense.">{t.value}</span>;
          case "magic":    return <span key={i} style={{ color: "#5b7ee5", fontWeight: 600 }} data-tip="Magic — scales with Magic Power or Defense. Reduced by enemy Magic Defense.">{t.value}</span>;
          case "hp":       return <span key={i} style={{ color: "#27ae60", fontWeight: 600 }} data-tip="Vitality — HP is your health pool. Healing restores HP; shields absorb damage before HP is lost.">{t.value}</span>;
          case "damage":   return <span key={i} style={{ color: "#ffffff", fontWeight: 600 }} data-tip="Damage — HP removed from the target. May be reduced by Physical or Magic Defense.">{t.value}</span>;
          case "keyword":  return <span key={i} style={{ color: "#c084fc", fontWeight: 600 }} data-tip="Mechanic — a crowd control effect, movement modifier, or ability enhancement.">{t.value}</span>;
          case "number":   return <span key={i} style={{ color: "#e8b84b", fontWeight: 700 }} data-tip="Numeric value or percentage scaling">{t.value}</span>;
          default:         return <React.Fragment key={i}>{t.value}</React.Fragment>;
        }
      })}
    </span>
  );
}

type TokenType = "number" | "physical" | "magic" | "hp" | "damage" | "keyword" | "text";
type Token = { type: TokenType; value: string };

// Longer phrases first so they match before their substrings
const PHYSICAL_RE = /\b(?:Total Physical Attack|Physical (?:Attack|Defense|Damage|Lifesteal)|physical)\b/gi;
const MAGIC_RE    = /\b(?:Total Magic Power|Magic (?:Power|Defense|Damage)|Max Mana|Mana(?:\s+Regen)?|Spell Vamp|magic)\b/gi;
const HP_RE       = /\b(?:Max HP|HP(?:\s+Regen)?|lifesteal|heal(?:s|ing|ed)?|shield(?:s|ing)?|regen(?:erat(?:e|es|ion|ing))?)\b/gi;
const DAMAGE_RE   = /\b(?:true damage|critical damage|damage)\b/gi;
const KEYWORD_RE  = /\b(?:Attack Speed|Movement Speed|Critical Rate|knock(?:\s*(?:back|up))?|extra|bonus|additional|enhanced|empowered|scaling|scales?|stacks?|charges?|passive|active|cooldown|reset|dash|blink|stun(?:ned)?|slow(?:ed)?|silence(?:d)?|immobilize(?:d)?|airborne|root(?:ed)?|freeze|frozen|fear(?:ed)?|taunt(?:ed)?|blind(?:ed)?)\b/gi;

function splitByRe(raw: string, re: RegExp, type: TokenType): Token[] {
  const out: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) out.push({ type: "text", value: raw.slice(last, m.index) });
    out.push({ type, value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < raw.length) out.push({ type: "text", value: raw.slice(last) });
  return out.length ? out : [{ type: "text", value: raw }];
}

function splitText(raw: string): Token[] {
  const passes: [RegExp, TokenType][] = [
    [PHYSICAL_RE, "physical"],
    [MAGIC_RE,    "magic"],
    [HP_RE,       "hp"],
    [DAMAGE_RE,   "damage"],
    [KEYWORD_RE,  "keyword"],
  ];
  let tokens: Token[] = [{ type: "text", value: raw }];
  for (const [re, type] of passes) {
    const next: Token[] = [];
    for (const t of tokens) {
      if (t.type === "text") next.push(...splitByRe(t.value, re, type));
      else next.push(t);
    }
    tokens = next;
  }
  return tokens;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const re = /(\d+(?:\.\d+)?%(?:~\d+(?:\.\d+)?%)?|\d+(?:\.\d+)?%|\d+(?:\.\d+)?)/g;

  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push(...splitText(text.slice(last, m.index)));
    tokens.push({ type: "number", value: m[0] });
    last = m.index + m[0].length;
  }

  if (last < text.length) tokens.push(...splitText(text.slice(last)));

  return tokens;
}
