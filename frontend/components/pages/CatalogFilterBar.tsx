import type { FilterChip } from "@/lib/catalogFilters";

const chipClass = (active: boolean) =>
  `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
    active
      ? "bg-primary-container text-on-primary shadow-[0_0_20px_rgba(229,195,120,0.35)]"
      : "bg-surface-low text-on-surface-variant hover:text-primary"
  }`;

export function CatalogFilterBar({
  query,
  onQuery,
  placeholder,
  groups,
  groupId,
  onGroup,
  stocks = [],
  stockId = "all",
  onStock,
}: {
  query: string;
  onQuery: (value: string) => void;
  placeholder: string;
  groups: FilterChip[];
  groupId: string;
  onGroup: (id: string) => void;
  stocks?: FilterChip[];
  stockId?: string;
  onStock?: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="relative block max-w-md">
        <span className="sr-only">{placeholder}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-[#EAD9B0] bg-white px-4 py-2.5 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:border-primary"
        />
      </label>
      {groups.length ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label={placeholder}>
          {groups.map((chip) => (
            <button key={chip.id} type="button" aria-pressed={groupId === chip.id} onClick={() => onGroup(chip.id)} className={chipClass(groupId === chip.id)}>
              {chip.label}
              <span className="ml-1.5 text-[11px] font-bold opacity-80">{chip.count}</span>
            </button>
          ))}
        </div>
      ) : null}
      {stocks.length && onStock ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Availability">
          <button type="button" aria-pressed={stockId === "all"} onClick={() => onStock("all")} className={chipClass(stockId === "all")}>
            Any availability
          </button>
          {stocks
            .filter((chip) => chip.id !== "all")
            .map((chip) => (
              <button key={chip.id} type="button" aria-pressed={stockId === chip.id} onClick={() => onStock(chip.id)} className={chipClass(stockId === chip.id)}>
                {chip.label}
                <span className="ml-1.5 text-[11px] font-bold opacity-80">{chip.count}</span>
              </button>
            ))}
        </div>
      ) : null}
    </div>
  );
}
