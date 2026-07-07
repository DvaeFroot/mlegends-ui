export interface StatMeta { iconUrl: string | null; icon: string; label: string; color: string }

const CDN = "https://static.wikia.nocookie.net/leagueoflegends/images";

const ICONS = {
  health:        `${CDN}/1/17/Health_icon.png`,
  health_regen:  `${CDN}/3/31/Health_regeneration_icon.png`,
  attack:        `${CDN}/7/75/Attack_damage_icon.png`,
  ap:            `${CDN}/0/0a/Ability_power_icon.png`,
  armor:         `${CDN}/f/f0/Armor_icon.png`,
  mr:            `${CDN}/8/84/Magic_resistance_icon.png`,
  atk_speed:     `${CDN}/9/91/Attack_speed_icon.png`,
  range:         `${CDN}/1/13/Range_icon.png`,
  move_speed:    `${CDN}/e/ea/Movement_speed_icon.png`,
  mana:          `${CDN}/8/8b/Mana_icon.png`,
  mana_regen:    `${CDN}/0/0c/Mana_regeneration_icon.png`,
  magic_pen:     `${CDN}/6/62/Magic_penetration_icon.png`,
  armor_pen:     `${CDN}/6/64/Armor_penetration_icon.png`,
  crit:          `${CDN}/4/41/Critical_strike_icon.png`,
  lifesteal:     `${CDN}/7/76/Life_steal_icon.png`,
  omnivamp:      `${CDN}/3/35/Omnivamp_icon.png`,
  spell_vamp:    `${CDN}/f/f2/Spell_vamp_icon.png`,
  cdr:           `${CDN}/9/95/Cooldown_reduction_icon.png`,
  energy:        `${CDN}/7/7d/Energy_icon.png`,
} as const;

// Color palette
const C = {
  phys:   "#e05a2b",  // physical offense/defense
  magic:  "#5b7ee5",  // magic offense/defense
  hp:     "#27ae60",  // health/vitality
  spd:    "#38bdf8",  // movement/attack speed/range
  mana:   "#7dd3fc",  // mana/energy
  crit:   "#e8b84b",  // crit/hybrid
  util:   "#a78bfa",  // cooldown/utility
  dim:    "#8b92a8",  // fallback
} as const;

function i(iconUrl: string, label: string, color: string): StatMeta {
  return { iconUrl, icon: "", label, color };
}
function t(icon: string, label: string, color: string): StatMeta {
  return { iconUrl: null, icon, label, color };
}

const MAP: Record<string, StatMeta> = {
  // Health
  hp:                    i(ICONS.health,      "HP",                    C.hp),
  hp_regen:              i(ICONS.health_regen,"HP Regen",              C.hp),
  armor_hp:              i(ICONS.health,      "Armor HP",              C.hp),

  // Physical offense
  physical_attack:       i(ICONS.attack,      "Physical Attack",       C.phys),
  physical_atk:          i(ICONS.attack,      "Physical Attack",       C.phys),
  adaptive_attack:       i(ICONS.attack,      "Adaptive Attack",       C.phys),
  base_damage:           i(ICONS.attack,      "Base Damage",           C.phys),
  slash_damage:          i(ICONS.attack,      "Slash Damage",          C.phys),
  physical_pen:          i(ICONS.armor_pen,   "Physical Pen",          C.phys),
  lifesteal:             i(ICONS.lifesteal,   "Physical Lifesteal",    C.phys),

  // Magic offense
  magic_power:           i(ICONS.ap,          "Magic Power",           C.magic),
  magic_penetration:     i(ICONS.magic_pen,   "Magic Pen",             C.magic),
  magic_lifesteal:       i(ICONS.omnivamp,    "Magic Lifesteal",       C.magic),
  spell_vamp:            i(ICONS.spell_vamp,  "Spell Vamp",            C.magic),

  // Hybrid offense
  hybrid_lifesteal:      i(ICONS.omnivamp,    "Hybrid Lifesteal",      C.crit),
  crit_chance:           i(ICONS.crit,        "Crit Rate",             C.crit),
  damage_to_monsters:    i(ICONS.attack,      "Damage to Monsters",    C.phys),

  // Defense
  physical_defense:      i(ICONS.armor,       "Physical Defense",      C.phys),
  magic_defense:         i(ICONS.mr,          "Magic Defense",         C.magic),
  hybrid_defense:        i(ICONS.armor,       "Hybrid Defense",        C.crit),
  reduce_hybrid_defense: i(ICONS.armor,       "Reduce Hybrid Defense", C.crit),
  damage_taken:          i(ICONS.armor,       "Damage Taken",          C.phys),

  // Speed
  movement_speed:        i(ICONS.move_speed,  "Movement Speed",        C.spd),
  movement_spd:          i(ICONS.move_speed,  "Movement Speed",        C.spd),
  attack_speed:          i(ICONS.atk_speed,   "Attack Speed",          C.spd),
  attack_rate:           i(ICONS.atk_speed,   "Attack Speed",          C.spd),
  attack_speed_ratio:    i(ICONS.atk_speed,   "Attack Speed Ratio",    C.spd),
  slow_reduction:        i(ICONS.move_speed,  "Slow Reduction",        C.spd),
  basic_attack_range:    i(ICONS.range,       "Attack Range",          C.spd),

  // Mana / Energy
  mana:                  i(ICONS.mana,        "Mana",                  C.mana),
  mana_regen:            i(ICONS.mana_regen,  "Mana Regen",            C.mana),
  mana_cost:             i(ICONS.mana,        "Mana Cost",             C.mana),
  energy:                i(ICONS.energy,      "Energy",                C.mana),
  energy_regen:          i(ICONS.energy,      "Energy Regen",          C.mana),
  resolve_regen:         i(ICONS.energy,      "Resolve Regen",         C.mana),

  // Utility
  cooldown:              i(ICONS.cdr,         "Cooldown",              C.util),
  cooldown_reduction:    i(ICONS.cdr,         "Cooldown Reduction",    C.util),
  cd_reduction:          i(ICONS.cdr,         "CD Reduction",          C.util),
  duration:              i(ICONS.cdr,         "Duration",              C.util),
};

export function getStatMeta(key: string): StatMeta {
  const normalized = key.toLowerCase().replace(/\s+/g, "_");
  return MAP[normalized] ?? {
    iconUrl: null,
    icon: "·",
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    color: C.dim,
  };
}
