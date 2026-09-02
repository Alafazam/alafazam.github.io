// Pure loan maths for the EMI scenario planner. Kept free of React so a schedule
// can be reasoned about (and checked against a bank's own numbers) on its own.
//
// There is no bank-baseline built in here: comparison is scenario-against-
// scenario, and a "Bank minimum" scenario is seeded on the page instead, so
// simulating a second schedule inside every run would be redundant work.

export interface Prepayment {
  id: string;
  /** 1-based month index counted from the loan start. */
  month: number;
  amount: number;
}

export interface LoanInputs {
  principal: number;
  /** Nominal annual rate, as a percentage (e.g. 8.5). */
  annualRate: number;
  tenureYears: number;
  /** ISO `yyyy-mm-dd`. The first EMI is charged in this month. */
  startDate: string;
  /** What you intend to pay each month. Floored at the bank minimum. */
  startingEmi: number;
  /** How much the EMI is raised every 12 months, as a percentage. */
  stepUpPercent: number;
  /** Pay a 13th EMI every year. */
  extraEmiPerYear: boolean;
  prepayments: Prepayment[];
}

export interface ScheduleRow {
  /** 1-based month index from the loan start. */
  month: number;
  /** 1-based loan year the month falls in. */
  year: number;
  label: string;
  openingBalance: number;
  /** Everything that left your account this month, extras included. */
  emi: number;
  interest: number;
  principal: number;
  /** The 13th EMI and one-off prepayments for this month. */
  extra: number;
  balance: number;
  cumulativeInterest: number;
}

export interface LoanPlan {
  /** The EMI the bank would demand for this principal, rate and tenure. */
  baseEmi: number;
  schedule: ScheduleRow[];
  /** Months until the balance clears. */
  months: number;
  totalInterest: number;
  totalPaid: number;
  totalExtra: number;
  /** Largest monthly outgo, which is what affordability actually turns on. */
  peakEmi: number;
  /** Month the last rupee is paid, or 'Never' for an unpayable loan. */
  payoffLabel: string;
}

/** Balances below this are rounding dust, not debt. */
const CLOSED = 0.5;

/** 60 years. Guards the simulation against an EMI that never clears interest. */
const MAX_MONTHS = 720;

export const monthsInYears = (years: number): number => Math.round(years * 12);

/** Standard amortising EMI. Falls back to straight-line for a 0% loan. */
export const computeEmi = (principal: number, annualRate: number, months: number): number => {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r <= 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
};

/** Parses `yyyy-mm-dd` in local time — `new Date(iso)` would parse it as UTC. */
export const parseStartDate = (iso: string): Date => {
  const [y, m, d] = (iso || '').split('-').map(Number);
  if (!y || !m) return new Date(2000, 0, 1);
  return new Date(y, m - 1, d || 1);
};

const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' });

/** Label for the nth month (1-based) of the loan. */
export const monthLabel = (start: Date, month: number): string => {
  const d = new Date(start.getFullYear(), start.getMonth() + month - 1, 1);
  return monthFormatter.format(d);
};

const emptyPlan = (baseEmi = 0): LoanPlan => ({
  baseEmi,
  schedule: [],
  months: 0,
  totalInterest: 0,
  totalPaid: 0,
  totalExtra: 0,
  peakEmi: 0,
  payoffLabel: '—',
});

export function buildLoanPlan(inputs: LoanInputs): LoanPlan {
  const {
    principal,
    annualRate,
    tenureYears,
    startDate,
    startingEmi,
    stepUpPercent,
    extraEmiPerYear,
    prepayments,
  } = inputs;

  const tenureMonths = monthsInYears(tenureYears);
  const baseEmi = computeEmi(principal, annualRate, tenureMonths);
  if (principal <= 0 || tenureMonths <= 0 || annualRate < 0) return emptyPlan(baseEmi);

  const start = parseStartDate(startDate);
  const monthlyRate = annualRate / 12 / 100;
  // Paying less than the bank asks is not a plan the bank would allow.
  let emi = Math.max(startingEmi || 0, baseEmi);
  const stepUp = Math.max(0, stepUpPercent) / 100;

  // One-off prepayments, collapsed to a single amount per month.
  const prepayByMonth = new Map<number, number>();
  for (const p of prepayments) {
    if (p.amount > 0 && p.month >= 1) {
      prepayByMonth.set(p.month, (prepayByMonth.get(p.month) || 0) + p.amount);
    }
  }

  const schedule: ScheduleRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  let totalExtra = 0;
  let peakEmi = 0;
  let months = 0;

  for (let m = 1; m <= MAX_MONTHS && balance > CLOSED; m++) {
    // The step-up lands on each loan anniversary, before that month's EMI.
    if (m > 1 && (m - 1) % 12 === 0) emi *= 1 + stepUp;

    let extra = prepayByMonth.get(m) || 0;
    if (extraEmiPerYear && m % 12 === 0) extra += emi;

    const opening = balance;
    const interest = opening * monthlyRate;
    // An EMI that does not even cover the interest pays off no principal; the
    // MAX_MONTHS ceiling is what stops such a loan from looping forever.
    let paidPrincipal = Math.min(Math.max(emi - interest, 0) + extra, opening);
    if (paidPrincipal < 0) paidPrincipal = 0;
    const paidExtra = Math.min(extra, paidPrincipal);

    balance = opening - paidPrincipal;
    totalInterest += interest;
    totalPaid += interest + paidPrincipal;
    totalExtra += paidExtra;
    peakEmi = Math.max(peakEmi, interest + paidPrincipal);
    months = m;

    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      label: monthLabel(start, m),
      openingBalance: opening,
      emi: interest + paidPrincipal,
      interest,
      principal: paidPrincipal,
      extra: paidExtra,
      balance: Math.max(0, balance),
      cumulativeInterest: totalInterest,
    });
  }

  return {
    baseEmi,
    schedule,
    months,
    totalInterest,
    totalPaid,
    totalExtra,
    peakEmi,
    payoffLabel: balance <= CLOSED ? monthLabel(start, months) : 'Never',
  };
}

export interface YearSummary {
  year: number;
  label: string;
  principal: number;
  interest: number;
  extra: number;
  paid: number;
  closingBalance: number;
  months: ScheduleRow[];
}

/** Groups the paying months into loan years for a schedule table. */
export function summariseByYear(schedule: ScheduleRow[]): YearSummary[] {
  const years: YearSummary[] = [];
  for (const row of schedule) {
    let bucket = years[years.length - 1];
    if (!bucket || bucket.year !== row.year) {
      bucket = {
        year: row.year,
        label: '',
        principal: 0,
        interest: 0,
        extra: 0,
        paid: 0,
        closingBalance: 0,
        months: [],
      };
      years.push(bucket);
    }
    bucket.principal += row.principal;
    bucket.interest += row.interest;
    bucket.extra += row.extra;
    bucket.paid += row.emi;
    bucket.closingBalance = row.balance;
    bucket.months.push(row);
  }
  for (const y of years) {
    const first = y.months[0];
    const last = y.months[y.months.length - 1];
    y.label = first === last ? first.label : `${first.label} – ${last.label}`;
  }
  return years;
}
