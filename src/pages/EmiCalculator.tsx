import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Copy,
  Eye,
  EyeOff,
  IndianRupee,
  Info,
  Pencil,
  Plus,
  RotateCcw,
  Target,
  Trash2,
  Wallet,
  Zap,
} from 'lucide-react';
import ScenarioLineChart, { type ChartSeries } from '../components/charts/ScenarioLineChart';
import ScenarioBars from '../components/charts/ScenarioBars';
import { buildLoanPlan, monthLabel, monthsInYears, parseStartDate, type LoanPlan } from '../utils/loan';
import {
  DEFAULT_INPUTS,
  SCENARIO_LIMIT,
  VARIANTS,
  baseEmiFor,
  cloneInputs,
  clearState,
  describeInputs,
  loadState,
  makeScenario,
  nextColorIndex,
  nextId,
  saveState,
  seedScenarios,
  startingEmiFor,
  toLoanInputs,
  type Scenario,
  type ScenarioInputs,
} from '../utils/scenarios';
import { formatCompactINR, formatDuration, formatINR, toIndianWords } from '../utils/currency';

/** Matches the --viz-n custom properties defined in src/index.css. */
const seriesColor = (colorIndex: number): string => `var(--viz-${colorIndex + 1})`;

/** First of the current month — the month a first EMI would be charged in. */
const currentMonthISO = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
};

/** Digits only, so a field can be cleared and pasted into freely. */
const parseAmount = (raw: string): number => {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  return digits ? Number(digits) : 0;
};

const groupDigits = (value: number): string =>
  value ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '';

const cardClass =
  'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 p-5';
const labelClass =
  'block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5';
const inputClass =
  'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const rangeClass =
  'w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-blue-600';
const ghostButton =
  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';

type MetricId = 'balance' | 'interest' | 'payment';

const METRICS: { id: MetricId; label: string; description: string }[] = [
  {
    id: 'balance',
    label: 'Outstanding balance',
    description: 'What you still owe, month by month. The line that hits zero first wins.',
  },
  {
    id: 'interest',
    label: 'Interest paid',
    description: 'Interest handed to the bank so far — where the curves split is where the saving starts.',
  },
  {
    id: 'payment',
    label: 'Monthly payment',
    description: 'What actually leaves your account each month, step-ups and extra EMIs included.',
  },
];

const EmiCalculator = () => {
  // Empty until mounted: the current month is not knowable at prerender time,
  // and this page is hydrated from react-snap's markup, so nothing in the first
  // render may depend on the clock or on storage.
  const [startDate, setStartDate] = useState('');
  const [scenarios, setScenarios] = useState<Scenario[]>(seedScenarios);
  const [draft, setDraft] = useState<ScenarioInputs>(() => cloneInputs(DEFAULT_INPUTS));
  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [metric, setMetric] = useState<MetricId>('balance');
  const [confirmClear, setConfirmClear] = useState(false);
  const [newPrepayment, setNewPrepayment] = useState({ month: 24, amount: 200000 });

  // Restore before the first save runs, so an empty first render never
  // overwrites what is already on disk.
  const restored = useRef(false);
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setScenarios(saved.scenarios);
      setDraft(saved.draft);
      setBaselineId(saved.baselineId);
      setStartDate(saved.startDate || currentMonthISO());
    } else {
      setStartDate(currentMonthISO());
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    saveState({ scenarios, draft, startDate, baselineId });
  }, [scenarios, draft, startDate, baselineId]);

  const effectiveStart = startDate || currentMonthISO();
  const loanStart = useMemo(() => parseStartDate(effectiveStart), [effectiveStart]);

  const draftBaseEmi = baseEmiFor(draft);
  const draftEmi = startingEmiFor(draft);

  const draftPlan = useMemo(
    () => buildLoanPlan(toLoanInputs(draft, effectiveStart)),
    [draft, effectiveStart]
  );

  const plans = useMemo(() => {
    const map = new Map<string, LoanPlan>();
    for (const s of scenarios) map.set(s.id, buildLoanPlan(toLoanInputs(s.inputs, effectiveStart)));
    return map;
  }, [scenarios, effectiveStart]);

  const baseline = scenarios.find((s) => s.id === baselineId) || scenarios[0];
  const baselinePlan = baseline ? plans.get(baseline.id) : undefined;
  const visible = scenarios.filter((s) => s.visible);
  const atLimit = scenarios.length >= SCENARIO_LIMIT;

  // ------------------------------------------------------------- mutations

  const patchDraft = useCallback(
    (patch: Partial<ScenarioInputs>) => setDraft((d) => ({ ...d, ...patch })),
    []
  );

  const addScenario = useCallback(
    (name: string, inputs: ScenarioInputs) => {
      setScenarios((list) => {
        if (list.length >= SCENARIO_LIMIT) return list;
        const next = [...list, makeScenario(name, inputs, nextColorIndex(list))];
        return next;
      });
    },
    []
  );

  const commitDraft = () => {
    if (editingId) {
      setScenarios((list) =>
        list.map((s) => (s.id === editingId ? { ...s, inputs: cloneInputs(draft) } : s))
      );
      setEditingId(null);
      return;
    }
    addScenario(`Scenario ${scenarios.length + 1}`, draft);
  };

  const applyVariant = (variantId: string) => {
    const variant = VARIANTS.find((v) => v.id === variantId);
    const result = variant?.apply(draft);
    if (result) addScenario(result.name, result.inputs);
  };

  const editScenario = (scenario: Scenario) => {
    setDraft(cloneInputs(scenario.inputs));
    setEditingId(scenario.id);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const duplicateScenario = (scenario: Scenario) =>
    addScenario(`${scenario.name} copy`, scenario.inputs);

  const removeScenario = (id: string) => {
    setScenarios((list) => list.filter((s) => s.id !== id));
    if (editingId === id) setEditingId(null);
    if (baselineId === id) setBaselineId(null);
  };

  const renameScenario = (id: string, name: string) =>
    setScenarios((list) => list.map((s) => (s.id === id ? { ...s, name } : s)));

  const toggleVisible = (id: string) =>
    setScenarios((list) => list.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));

  const clearAll = () => {
    clearState();
    setScenarios(seedScenarios());
    setDraft(cloneInputs(DEFAULT_INPUTS));
    setBaselineId(null);
    setEditingId(null);
    setConfirmClear(false);
  };

  // A stray click should not wipe a comparison, so the button asks once and
  // gives up on its own rather than trapping you in a confirm state.
  useEffect(() => {
    if (!confirmClear) return;
    const timer = setTimeout(() => setConfirmClear(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmClear]);

  const addPrepayment = () => {
    if (newPrepayment.amount <= 0 || newPrepayment.month < 1) return;
    patchDraft({
      prepayments: [
        ...draft.prepayments,
        { id: nextId('p'), month: newPrepayment.month, amount: newPrepayment.amount },
      ],
    });
  };

  // ---------------------------------------------------------------- charts

  const chartLabels = useMemo(() => {
    const longest = visible.reduce((best, s) => {
      const plan = plans.get(s.id);
      return plan && plan.schedule.length > best.length ? plan.schedule : best;
    }, [] as LoanPlan['schedule']);
    return longest.map((row) => row.label);
  }, [visible, plans]);

  const chartSeries: ChartSeries[] = useMemo(
    () =>
      visible.flatMap((s) => {
        const plan = plans.get(s.id);
        if (!plan || plan.schedule.length === 0) return [];
        const pick =
          metric === 'balance'
            ? (row: LoanPlan['schedule'][number]) => row.balance
            : metric === 'interest'
              ? (row: LoanPlan['schedule'][number]) => row.cumulativeInterest
              : (row: LoanPlan['schedule'][number]) => row.emi;
        return [
          {
            id: s.id,
            name: s.name,
            color: seriesColor(s.colorIndex),
            points: plan.schedule.map(pick),
          },
        ];
      }),
    [visible, plans, metric]
  );

  const barRows = useMemo(
    () =>
      visible.flatMap((s) => {
        const plan = plans.get(s.id);
        if (!plan) return [];
        return [
          {
            id: s.id,
            name: s.name,
            color: seriesColor(s.colorIndex),
            interest: plan.totalInterest,
            paid: plan.totalPaid,
          },
        ];
      }),
    [visible, plans]
  );

  const activeMetric = METRICS.find((m) => m.id === metric)!;

  const comparisonRows: {
    label: string;
    render: (scenario: Scenario, plan: LoanPlan) => string;
    /** Only set where "best" is meaningful — a lower EMI is not automatically better. */
    best?: (plan: LoanPlan) => number;
  }[] = [
    { label: 'Starting EMI', render: (s) => formatINR(startingEmiFor(s.inputs)) },
    { label: 'Peak monthly payment', render: (_s, p) => formatINR(p.peakEmi) },
    {
      label: 'Time to close',
      render: (_s, p) => formatDuration(p.months),
      best: (p) => p.months,
    },
    { label: 'Debt-free by', render: (_s, p) => p.payoffLabel },
    {
      label: 'Total interest',
      render: (_s, p) => formatINR(p.totalInterest),
      best: (p) => p.totalInterest,
    },
    {
      label: 'Total outgo',
      render: (_s, p) => formatINR(p.totalPaid),
      best: (p) => p.totalPaid,
    },
    {
      label: 'Extra paid in',
      render: (_s, p) => (p.totalExtra > 0 ? formatINR(p.totalExtra) : '—'),
    },
    {
      label: 'Interest as % of loan',
      render: (s, p) =>
        s.inputs.principal ? `${Math.round((p.totalInterest / s.inputs.principal) * 100)}%` : '—',
    },
  ];

  return (
    <div className="py-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        <Helmet>
          <title>EMI Scenario Planner — Alaf Azam Khan</title>
          <meta
            name="description"
            content="Build and compare home-loan repayment scenarios side by side: a higher EMI, a longer or shorter tenure, an annual step-up, a 13th EMI or a one-off prepayment — and see the interest and years each one saves."
          />
          <link rel="canonical" href="https://alafazam.com/projects/emi-calculator" />
        </Helmet>

        <header className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All work
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">EMI Scenario Planner</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            The EMI is the easy half. The useful half is the what-ifs — pay ₹5k more a month,
            stretch to 25 years, add a 13th EMI, step up 5% a year, drop a bonus in at year two.
            Build each one as a scenario and compare them side by side.
          </p>
        </header>

        {/* ------------------------------------------------------------ builder */}
        <section className={`${cardClass} mb-6`} aria-labelledby="builder-heading">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <h2 id="builder-heading" className="flex items-center gap-2 font-semibold">
              <IndianRupee className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              {editingId ? 'Editing a scenario' : 'Build a scenario'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setDraft(cloneInputs(DEFAULT_INPUTS));
                setEditingId(null);
              }}
              className={ghostButton}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset inputs
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* the loan */}
            <div className="space-y-5">
              <div>
                <label className={labelClass} htmlFor="loan-amount">
                  Loan amount
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    id="loan-amount"
                    type="text"
                    inputMode="numeric"
                    value={groupDigits(draft.principal)}
                    onChange={(e) => patchDraft({ principal: parseAmount(e.target.value) })}
                    className={`${inputClass} pl-7 text-lg font-semibold`}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {toIndianWords(draft.principal)}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label className={`${labelClass} mb-0`} htmlFor="interest-rate">
                    Interest rate
                  </label>
                  <span className="text-sm font-semibold tabular-nums">
                    {draft.annualRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  id="interest-rate"
                  type="range"
                  min={1}
                  max={20}
                  step={0.05}
                  value={draft.annualRate}
                  onChange={(e) => patchDraft({ annualRate: Number(e.target.value) })}
                  className={rangeClass}
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label className={`${labelClass} mb-0`} htmlFor="tenure">
                    Tenure
                  </label>
                  <span className="text-sm font-semibold tabular-nums">
                    {draft.tenureYears} {draft.tenureYears === 1 ? 'year' : 'years'}
                  </span>
                </div>
                <input
                  id="tenure"
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={draft.tenureYears}
                  onChange={(e) => patchDraft({ tenureYears: Number(e.target.value) })}
                  className={rangeClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="start-date">
                  First EMI <span className="normal-case font-normal">(shared by all scenarios)</span>
                </label>
                <div className="relative">
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                  />
                  <CalendarDays
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* what you pay */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                What you&rsquo;ll pay
              </h3>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/80 px-3 py-2.5">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Bank minimum EMI</p>
                  <p className="font-semibold tabular-nums">{formatINR(draftBaseEmi)}</p>
                </div>
                {draft.startingEmi !== null && (
                  <button
                    type="button"
                    onClick={() => patchDraft({ startingEmi: null })}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Match it
                  </button>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="starting-emi">
                  Your starting EMI
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    id="starting-emi"
                    type="text"
                    inputMode="numeric"
                    value={groupDigits(draftEmi)}
                    onChange={(e) => patchDraft({ startingEmi: parseAmount(e.target.value) })}
                    className={`${inputClass} pl-7 font-semibold`}
                  />
                </div>
                <input
                  aria-label="Your starting EMI"
                  type="range"
                  min={Math.round(draftBaseEmi)}
                  max={Math.max(Math.round(draftBaseEmi) * 2, Math.round(draftBaseEmi) + 1000)}
                  step={500}
                  value={Math.min(draftEmi, Math.max(Math.round(draftBaseEmi) * 2, Math.round(draftBaseEmi) + 1000))}
                  onChange={(e) => patchDraft({ startingEmi: Number(e.target.value) })}
                  className={`${rangeClass} mt-3`}
                />
                <div className="mt-1 flex justify-between text-[11px] text-gray-400">
                  <span>Minimum</span>
                  <span>2× minimum</span>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/80 px-3 py-2.5 text-xs space-y-1">
                <p className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Closes in</span>
                  <span className="font-semibold tabular-nums">{formatDuration(draftPlan.months)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total interest</span>
                  <span className="font-semibold tabular-nums">
                    {formatCompactINR(draftPlan.totalInterest)}
                  </span>
                </p>
              </div>
            </div>

            {/* boosters */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Payoff boosters
              </h3>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label className={`${labelClass} mb-0`} htmlFor="step-up">
                    Annual step-up
                  </label>
                  <span className="text-sm font-semibold tabular-nums">{draft.stepUpPercent}%</span>
                </div>
                <input
                  id="step-up"
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={draft.stepUpPercent}
                  onChange={(e) => patchDraft({ stepUpPercent: Number(e.target.value) })}
                  className={rangeClass}
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Raise the EMI this much every year, roughly in step with a raise.
                </p>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">One extra EMI a year</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    A 13th instalment every 12th month.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft.extraEmiPerYear}
                  aria-label="Pay one extra EMI a year"
                  onClick={() => patchDraft({ extraEmiPerYear: !draft.extraEmiPerYear })}
                  className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
                    draft.extraEmiPerYear ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                      draft.extraEmiPerYear ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div>
                <p className={labelClass}>One-off prepayments</p>
                {draft.prepayments.length > 0 && (
                  <ul className="mb-2 space-y-1.5">
                    {draft.prepayments.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm"
                      >
                        <span className="tabular-nums">
                          {formatINR(p.amount)}
                          <span className="text-gray-500 dark:text-gray-400">
                            {' '}
                            in {monthLabel(loanStart, p.month)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            patchDraft({ prepayments: draft.prepayments.filter((x) => x.id !== p.id) })
                          }
                          aria-label={`Remove the ${formatINR(p.amount)} prepayment in ${monthLabel(loanStart, p.month)}`}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1" htmlFor="prepay-amount">
                      Amount
                    </label>
                    <input
                      id="prepay-amount"
                      type="text"
                      inputMode="numeric"
                      value={groupDigits(newPrepayment.amount)}
                      onChange={(e) =>
                        setNewPrepayment((d) => ({ ...d, amount: parseAmount(e.target.value) }))
                      }
                      className={`${inputClass} py-1.5 text-sm`}
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1" htmlFor="prepay-month">
                      Month #
                    </label>
                    <input
                      id="prepay-month"
                      type="number"
                      min={1}
                      max={monthsInYears(draft.tenureYears)}
                      value={newPrepayment.month}
                      onChange={(e) =>
                        setNewPrepayment((d) => ({ ...d, month: Math.max(1, Number(e.target.value) || 1) }))
                      }
                      className={`${inputClass} py-1.5 text-sm`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addPrepayment}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Month {newPrepayment.month} is {monthLabel(loanStart, newPrepayment.month)}.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={commitDraft}
              disabled={!editingId && atLimit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Save changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add scenario
                </>
              )}
            </button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} className={ghostButton}>
                Cancel
              </button>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {atLimit
                ? `${SCENARIO_LIMIT} scenarios is the limit — delete one to add another.`
                : `${scenarios.length} of ${SCENARIO_LIMIT} scenarios.`}
            </p>
          </div>

          <div className="mt-5">
            <p className={labelClass}>Or branch off these inputs in one click</p>
            <div className="flex flex-wrap gap-2">
              {VARIANTS.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => applyVariant(variant.id)}
                  disabled={atLimit || variant.apply(draft) === null}
                  title={variant.hint}
                  className="rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {variant.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- scenario strip */}
        <section className="mb-6" aria-labelledby="scenarios-heading">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 id="scenarios-heading" className="font-semibold">
              Your scenarios
            </h2>
            <button
              type="button"
              onClick={() => (confirmClear ? clearAll() : setConfirmClear(true))}
              className={
                confirmClear
                  ? 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                  : ghostButton
              }
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              {confirmClear ? 'Clear everything — sure?' : 'Clear all'}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => {
              const plan = plans.get(scenario.id);
              if (!plan) return null;
              const isBaseline = baseline?.id === scenario.id;
              const deltaInterest = baselinePlan ? plan.totalInterest - baselinePlan.totalInterest : 0;
              const deltaMonths = baselinePlan ? plan.months - baselinePlan.months : 0;

              return (
                <article
                  key={scenario.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    scenario.visible
                      ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40'
                      : 'border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: seriesColor(scenario.colorIndex) }}
                      aria-hidden="true"
                    />
                    <input
                      value={scenario.name}
                      onChange={(e) => renameScenario(scenario.id, e.target.value)}
                      aria-label={`Name of scenario ${scenario.name}`}
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -mx-1"
                    />
                    {isBaseline && (
                      <span className="shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                        Baseline
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {describeInputs(scenario.inputs).map((chip) => (
                      <span
                        key={chip}
                        className="rounded bg-gray-100 dark:bg-gray-700/60 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <dl className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Closes in</dt>
                      <dd className="font-semibold tabular-nums">{formatDuration(plan.months)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Interest</dt>
                      <dd className="font-semibold tabular-nums">
                        {formatCompactINR(plan.totalInterest)}
                      </dd>
                    </div>
                    {!isBaseline && baselinePlan && (
                      <div className="flex justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
                        <dt className="text-gray-500 dark:text-gray-400">vs baseline</dt>
                        <dd
                          className={`font-semibold tabular-nums ${
                            deltaInterest < 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : deltaInterest > 0
                                ? 'text-red-600 dark:text-red-400'
                                : ''
                          }`}
                        >
                          {deltaInterest === 0
                            ? 'same'
                            : `${deltaInterest < 0 ? '−' : '+'}${formatCompactINR(Math.abs(deltaInterest))}`}
                          {deltaMonths !== 0 && (
                            <span className="font-normal text-gray-500 dark:text-gray-400">
                              {' '}
                              · {deltaMonths < 0 ? '−' : '+'}
                              {formatDuration(Math.abs(deltaMonths))}
                            </span>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleVisible(scenario.id)}
                      className={ghostButton}
                      aria-pressed={scenario.visible}
                    >
                      {scenario.visible ? (
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {scenario.visible ? 'Shown' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBaselineId(scenario.id)}
                      disabled={isBaseline}
                      className={`${ghostButton} disabled:opacity-40`}
                      title="Compare the other scenarios against this one"
                    >
                      <Target className="h-3.5 w-3.5" aria-hidden="true" />
                      Baseline
                    </button>
                    <button type="button" onClick={() => editScenario(scenario)} className={ghostButton}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateScenario(scenario)}
                      disabled={atLimit}
                      className={`${ghostButton} disabled:opacity-40`}
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => removeScenario(scenario.id)}
                      disabled={scenarios.length === 1}
                      className={`${ghostButton} ml-auto hover:text-red-600 dark:hover:text-red-400 disabled:opacity-40`}
                      aria-label={`Delete scenario ${scenario.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------- comparison table */}
        <section className={`${cardClass} mb-6`} aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="font-semibold mb-1">
            Side by side
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Best value in each comparable row is highlighted.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Every scenario compared on EMI, time to close, total interest and total outgo.
              </caption>
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th scope="col" className="pb-3 pr-3 font-medium">
                    Metric
                  </th>
                  {scenarios.map((s) => (
                    <th key={s.id} scope="col" className="pb-3 px-3 font-medium text-right">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: seriesColor(s.colorIndex) }}
                          aria-hidden="true"
                        />
                        <span className="normal-case text-gray-900 dark:text-white">{s.name}</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonRows.map((row) => {
                  const bestValue = row.best
                    ? Math.min(
                        ...scenarios.map((s) => {
                          const plan = plans.get(s.id);
                          return plan ? row.best!(plan) : Infinity;
                        })
                      )
                    : null;

                  return (
                    <tr key={row.label}>
                      <th scope="row" className="py-2 pr-3 text-left font-normal text-gray-600 dark:text-gray-300">
                        {row.label}
                      </th>
                      {scenarios.map((s) => {
                        const plan = plans.get(s.id);
                        if (!plan) return <td key={s.id} className="py-2 px-3 text-right">—</td>;
                        const isBest =
                          bestValue !== null && row.best!(plan) === bestValue && scenarios.length > 1;
                        return (
                          <td
                            key={s.id}
                            className={`py-2 px-3 text-right tabular-nums whitespace-nowrap ${
                              isBest
                                ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {row.render(s, plan)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ------------------------------------------------------------ charts */}
        <section className={`${cardClass} mb-6`} aria-labelledby="charts-heading">
          <h2 id="charts-heading" className="font-semibold mb-3">
            Over the life of the loan
          </h2>

          <div className="inline-flex flex-wrap rounded-lg border border-gray-200 dark:border-gray-700 p-1 mb-3">
            {METRICS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetric(m.id)}
                aria-pressed={metric === m.id}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  metric === m.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{activeMetric.description}</p>

          {visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              Every scenario is hidden. Show one to draw the chart.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <ScenarioLineChart
                  series={chartSeries}
                  labels={chartLabels}
                  formatValue={formatINR}
                  formatTick={formatCompactINR}
                  ariaSummary={`${activeMetric.label} over time for ${visible
                    .map((s) => s.name)
                    .join(', ')}. The comparison table above carries the same numbers.`}
                />
              </div>

              {visible.length > 1 && (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                {visible.map((s) => (
                  <li key={s.id} className="inline-flex items-center gap-1.5">
                    <span
                      className="h-0.5 w-4 rounded"
                      style={{ background: seriesColor(s.colorIndex) }}
                      aria-hidden="true"
                    />
                    {s.name}
                  </li>
                ))}
              </ul>
              )}

              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-sm mb-3">What each one costs in total</h3>
                <ScenarioBars rows={barRows} formatValue={formatCompactINR} />
              </div>
            </>
          )}
        </section>

        <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Estimates only. Real loans carry processing fees, insurance and floating rates that reset
            your EMI or tenure, and some lenders cap or charge for prepayment — check your sanction
            letter before committing to a plan. Everything here is computed in your browser and saved
            only to this browser; nothing is sent anywhere, and &ldquo;Clear all&rdquo; removes it.
          </span>
        </p>
      </div>
    </div>
  );
};

export default EmiCalculator;
