export interface BarRow {
  id: string;
  name: string;
  color: string;
  /** Total interest paid over the life of the loan. */
  interest: number;
  /** Total money out: principal + interest. */
  paid: number;
}

interface ScenarioBarsProps {
  rows: BarRow[];
  formatValue: (value: number) => string;
}

/**
 * Total interest and total outgo per scenario, on one shared scale.
 *
 * Bars rather than another line: this is magnitude at a single point in time,
 * and a bar's length is the most accurately read encoding there is. Built from
 * divs, so the value labels are real text — which also satisfies the relief
 * rule for the lighter series colours, three of which sit under 3:1 on white.
 */
const ScenarioBars = ({ rows, formatValue }: ScenarioBarsProps) => {
  const max = Math.max(...rows.map((r) => r.paid), 1);

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.id}>
          <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: row.color }}
              aria-hidden="true"
            />
            <span className="truncate">{row.name}</span>
          </p>

          <div className="space-y-1.5 pl-3.5">
            {[
              { key: 'interest', label: 'Interest', value: row.interest, solid: true },
              { key: 'paid', label: 'Total outgo', value: row.paid, solid: false },
            ].map((bar) => (
              <div key={bar.key} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-[11px] text-gray-500 dark:text-gray-400">
                  {bar.label}
                </span>
                <span className="relative flex-1 h-3 rounded bg-gray-100 dark:bg-gray-800">
                  <span
                    className="absolute inset-y-0 left-0 rounded"
                    style={{
                      width: `${Math.max(1, (bar.value / max) * 100)}%`,
                      background: row.color,
                      // The outgo bar is the same hue at lower weight, so the
                      // pair reads as one scenario rather than two series.
                      opacity: bar.solid ? 1 : 0.4,
                    }}
                  />
                </span>
                <span className="w-24 shrink-0 text-right text-xs font-medium tabular-nums text-gray-900 dark:text-white">
                  {formatValue(bar.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioBars;
