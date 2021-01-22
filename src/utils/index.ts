export function joinSpace(...args: (string | undefined | null)[]) {
  return args.filter(Boolean).join(" ")
}
