import { getAdminUserDashboard } from "@/lib/admin-dashboard-stats";
import type { BreakdownRow } from "@/lib/admin-dashboard-stats";

function BreakdownTable({ title, rows }: { title: string; rows: BreakdownRow[] }) {
  if (rows.length === 0) {
    return (
      <section className="rounded border border-rule bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted">{title}</h2>
        <p className="mt-4 text-sm text-muted">暂无数据</p>
      </section>
    );
  }
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <section className="rounded border border-rule bg-white p-5 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted">{title}</h2>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 text-sm">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-ink" title={r.label}>
                  {r.label}
                </span>
                <span className="shrink-0 tabular-nums text-muted">{r.count}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-accent/80"
                  style={{ width: `${Math.round((r.count / max) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function AdminDashboardPage() {
  const d = await getAdminUserDashboard();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">数据看板</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        注册用户画像汇总（来自数据库 User 表）。访问量请在 Vercel → 本项目 →{" "}
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent underline underline-offset-2"
        >
          Analytics
        </a>{" "}
        查看。
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded border border-rule bg-white p-6 shadow-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">用户总数</p>
          <p className="mt-2 font-display text-4xl font-black tabular-nums text-ink">{d.usersTotal}</p>
          <p className="mt-2 text-sm text-muted">
            其中当前<strong className="text-ink">有效订阅</strong>：{d.subscribersActive} 人（与前台规则一致）
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <BreakdownTable title="性别分布" rows={d.byGender} />
        <BreakdownTable title="地区分布（前 50 项）" rows={d.byRegion} />
        <BreakdownTable title="职业 / 工作画像（前 50 项）" rows={d.byOccupation} />
      </div>
    </div>
  );
}
