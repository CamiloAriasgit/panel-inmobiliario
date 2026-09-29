export function CountryFlag({ iso }: { iso: string }) {
  return (
    <span
      className={`fi fi-${iso.toLowerCase()} rounded-sm`}
      style={{ width: "1.1em", height: "0.8em" }}
      aria-label={iso}
    />
  );
}