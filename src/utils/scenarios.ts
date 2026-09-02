// Scenario model for the EMI planner: the parameter sets you save, compare and
// persist. Everything here is plain data — the maths lives in ./loan.

import type { LoanInputs, Prepayment } from './loan';
import { computeEmi, monthsInYears } from './loan';
import { formatCompactINR } from './currency';

/** Per-scenario parameters. The loan start date is shared (see StoredState) so
 *  every scenario shares one x-axis and the charts stay comparable. */
export interface ScenarioInputs {
  principal: number;
  annualRate: number;
  tenureYears: number;
  /** null = follow the bank minimum, and keep following it as the loan changes. */
  startingEmi: number | null;
  stepUpPercent: number;
  extraEmiPerYear: boolean;
  prepayments: Prepayment[];
}

export interface Scenario {
  id: string;
  name: string;
  /** Index into the validated series palette (--viz-1…--viz-5). Never cycled. */
  colorIndex: number;
  visible: boolean;
  inputs: ScenarioInputs;
}

/** Five is what the validated categorical palette covers, and about as many
 *  lines as one chart can carry before comparison stops being possible. */
export const SCENARIO_LIMIT = 5;

export const DEFAULT_INPUTS: ScenarioInputs = {
  principal: 5000000,
  annualRate: 8.5,
  tenureYears: 20,
  startingEmi: null,
  stepUpPercent: 0,
  extraEmiPerYear: false,
  prepayments: [],
};

// Ids come from a counter rather than Date.now()/Math.random(): the page is
// prerendered by react-snap and then hydrated, so anything reachable from a
// render has to produce the same value at build time and in the browser.
let idSeq = 0;
export const nextId = (prefix: string): string => `${prefix}${++idSeq}`;

/** Pushes the counter past ids already in use, so a restore cannot collide. */
const reserveIds = (scenarios: Scenario[]): void => {
  for (const s of scenarios) {
    for (const id of [s.id, ...s.inputs.prepayments.map((p) => p.id)]) {
      const n = Number(id.replace(/^\D+/, ''));
      if (Number.isFinite(n) && n > idSeq) idSeq = n;
    }
  }
};

/** Bank-minimum EMI for a scenario's own principal / rate / tenure. */
export const baseEmiFor = (inputs: ScenarioInputs): number =>
  computeEmi(inputs.principal, inputs.annualRate, monthsInYears(inputs.tenureYears));

/** The EMI this scenario actually starts at, never below the bank minimum. */
export const startingEmiFor = (inputs: ScenarioInputs): number =>
  Math.max(inputs.startingEmi ?? 0, Math.round(baseEmiFor(inputs)));

export const toLoanInputs = (inputs: ScenarioInputs, startDate: string): LoanInputs => ({
  principal: inputs.principal,
  annualRate: inputs.annualRate,
  tenureYears: inputs.tenureYears,
  startDate,
  startingEmi: startingEmiFor(inputs),
  stepUpPercent: inputs.stepUpPercent,
  extraEmiPerYear: inputs.extraEmiPerYear,
  prepayments: inputs.prepayments,
});

export const cloneInputs = (inputs: ScenarioInputs): ScenarioInputs => ({
  ...inputs,
  prepayments: inputs.prepayments.map((p) => ({ ...p })),
});

/** Lowest palette slot not already taken — assigned in order, never cycled, so
 *  deleting a scenario never repaints the ones that remain. */
export const nextColorIndex = (scenarios: Scenario[]): number => {
  const taken = new Set(scenarios.map((s) => s.colorIndex));
  for (let i = 0; i < SCENARIO_LIMIT; i++) if (!taken.has(i)) return i;
  return 0;
};

export const makeScenario = (
  name: string,
  inputs: ScenarioInputs,
  colorIndex: number
): Scenario => ({
  id: nextId('s'),
  name,
  colorIndex,
  visible: true,
  inputs: cloneInputs(inputs),
});

export const seedScenarios = (): Scenario[] => [
  makeScenario('Bank minimum', DEFAULT_INPUTS, 0),
];

/** Short chips summarising a scenario's parameters, for its card. */
export const describeInputs = (inputs: ScenarioInputs): string[] => {
  const chips = [
    formatCompactINR(inputs.principal),
    `${inputs.annualRate}%`,
    `${inputs.tenureYears}y`,
    `EMI ${formatCompactINR(startingEmiFor(inputs))}`,
  ];
  if (inputs.stepUpPercent > 0) chips.push(`+${inputs.stepUpPercent}%/yr`);
  if (inputs.extraEmiPerYear) chips.push('13th EMI');
  const lumps = inputs.prepayments.length;
  if (lumps > 0) chips.push(`${lumps} lump sum${lumps > 1 ? 's' : ''}`);
  return chips;
};

// ---------------------------------------------------------------- quick variants

export interface Variant {
  id: string;
  label: string;
  hint: string;
  /** Null when the variant cannot apply — e.g. tenure already at the cap. */
  apply: (inputs: ScenarioInputs) => { name: string; inputs: ScenarioInputs } | null;
}

const withTenure = (inputs: ScenarioInputs, delta: number) => {
  const tenureYears = inputs.tenureYears + delta;
  if (tenureYears < 1 || tenureYears > 30) return null;
  return {
    name: `${inputs.tenureYears}y → ${tenureYears}y`,
    // Tenure changes move the bank minimum, so a scenario still tracking the
    // minimum should keep tracking it rather than freeze at the old number.
    inputs: { ...cloneInputs(inputs), tenureYears },
  };
};

export const VARIANTS: Variant[] = [
  {
    id: 'longer',
    label: '+2 years',
    hint: 'Stretch the tenure — lower EMI, more interest',
    apply: (inputs) => withTenure(inputs, 2),
  },
  {
    id: 'shorter',
    label: '−2 years',
    hint: 'Shorten the tenure — higher EMI, less interest',
    apply: (inputs) => withTenure(inputs, -2),
  },
  {
    id: 'higher-emi',
    label: '+₹5,000 EMI',
    hint: 'Pay ₹5,000 more every month from day one',
    apply: (inputs) => ({
      name: '+₹5,000 EMI',
      inputs: { ...cloneInputs(inputs), startingEmi: startingEmiFor(inputs) + 5000 },
    }),
  },
  {
    id: 'thirteenth',
    label: '13th EMI',
    hint: 'One extra instalment every year',
    apply: (inputs) =>
      inputs.extraEmiPerYear
        ? null
        : { name: '13th EMI/year', inputs: { ...cloneInputs(inputs), extraEmiPerYear: true } },
  },
  {
    id: 'step-up',
    label: '+5% step-up',
    hint: 'Raise the EMI 5% every year, roughly in step with a raise',
    apply: (inputs) => {
      const stepUpPercent = Math.min(25, inputs.stepUpPercent + 5);
      if (stepUpPercent === inputs.stepUpPercent) return null;
      return {
        name: `${stepUpPercent}% step-up`,
        inputs: { ...cloneInputs(inputs), stepUpPercent },
      };
    },
  },
  {
    id: 'lump-sum',
    label: '₹2L at year 2',
    hint: 'A one-off ₹2,00,000 prepayment in month 24',
    apply: (inputs) => ({
      name: '₹2L at year 2',
      inputs: {
        ...cloneInputs(inputs),
        prepayments: [
          ...inputs.prepayments.map((p) => ({ ...p })),
          { id: nextId('p'), month: 24, amount: 200000 },
        ],
      },
    }),
  },
];

// ------------------------------------------------------------------- persistence

const STORAGE_KEY = 'emi-scenarios-v1';

export interface StoredState {
  scenarios: Scenario[];
  draft: ScenarioInputs;
  startDate: string;
  baselineId: string | null;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const num = (v: unknown, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

const readPrepayments = (v: unknown): Prepayment[] => {
  if (!Array.isArray(v)) return [];
  return v.flatMap((raw) => {
    if (!isObject(raw)) return [];
    const month = num(raw.month, 0);
    const amount = num(raw.amount, 0);
    if (month < 1 || amount <= 0) return [];
    return [{ id: typeof raw.id === 'string' ? raw.id : nextId('p'), month, amount }];
  });
};

const readInputs = (v: unknown): ScenarioInputs => {
  if (!isObject(v)) return cloneInputs(DEFAULT_INPUTS);
  const startingEmi = v.startingEmi;
  return {
    principal: num(v.principal, DEFAULT_INPUTS.principal),
    annualRate: num(v.annualRate, DEFAULT_INPUTS.annualRate),
    tenureYears: num(v.tenureYears, DEFAULT_INPUTS.tenureYears),
    startingEmi: typeof startingEmi === 'number' && Number.isFinite(startingEmi) ? startingEmi : null,
    stepUpPercent: num(v.stepUpPercent, DEFAULT_INPUTS.stepUpPercent),
    extraEmiPerYear: v.extraEmiPerYear === true,
    prepayments: readPrepayments(v.prepayments),
  };
};

/**
 * Reads saved state, field by field. A private window, a full quota or a shape
 * left over from an older build must degrade to the seeded default — never to a
 * blank screen — so every failure path here returns null and the page re-seeds.
 */
export const loadState = (): StoredState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed) || !Array.isArray(parsed.scenarios)) return null;

    const scenarios: Scenario[] = parsed.scenarios
      .flatMap((s: unknown, i: number) => {
        if (!isObject(s)) return [];
        return [
          {
            id: typeof s.id === 'string' ? s.id : `s${i + 1}`,
            name: typeof s.name === 'string' && s.name.trim() ? s.name : `Scenario ${i + 1}`,
            colorIndex: Math.min(SCENARIO_LIMIT - 1, Math.max(0, num(s.colorIndex, i))),
            visible: s.visible !== false,
            inputs: readInputs(s.inputs),
          },
        ];
      })
      .slice(0, SCENARIO_LIMIT);

    if (scenarios.length === 0) return null;
    reserveIds(scenarios);

    const baselineId = typeof parsed.baselineId === 'string' ? parsed.baselineId : null;
    return {
      scenarios,
      draft: readInputs(parsed.draft),
      startDate: typeof parsed.startDate === 'string' ? parsed.startDate : '',
      baselineId: scenarios.some((s) => s.id === baselineId) ? baselineId : scenarios[0].id,
    };
  } catch {
    return null;
  }
};

export const saveState = (state: StoredState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private browsing or a full quota — the planner works fine without it */
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do: the in-memory reset below is the part that matters */
  }
};
