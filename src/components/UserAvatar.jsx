export function UserAvatar({ user, size = "h-9 w-9" }) {
  if (user?.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.photo} alt="" referrerPolicy="no-referrer" className={`${size} rounded-full object-cover`} />;
  }
  const letters = (user?.name || "?").split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  return (
    <span className={`${size} flex items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-soft-fg`} aria-hidden="true">
      {letters}
    </span>
  );
}
