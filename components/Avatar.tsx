import { User } from "@/lib/types";

export default function Avatar({
  user,
  size = 44,
}: {
  user?: User;
  size?: number;
}) {
  if (!user) return null;
  return (
    <div
      className="flex items-center justify-center rounded-full text-white shadow-inner shrink-0 select-none"
      style={{
        width: size,
        height: size,
        background: user.color,
        fontSize: size * 0.5,
      }}
      title={user.name}
      aria-label={user.name}
    >
      <span>{user.avatar}</span>
    </div>
  );
}
