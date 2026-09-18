import { setUser } from "@/lib/actions";
import { USERS, type SessionUser } from "@/lib/auth";
import { humanize } from "@/lib/format";

export function UserSwitcher({ current }: { current: SessionUser }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {USERS.map((u) => (
        <form key={u.id} action={setUser}>
          <input type="hidden" name="user" value={u.id} />
          <button
            type="submit"
            title={`Sign in as ${u.name} (${humanize(u.role)})`}
            className={
              u.id === current.id
                ? "rounded bg-white px-2 py-1 font-semibold text-neutral-900"
                : "rounded px-2 py-1 text-neutral-300 hover:bg-neutral-700"
            }
          >
            {humanize(u.role)}
          </button>
        </form>
      ))}
    </div>
  );
}
