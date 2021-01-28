export function joinSpace(...args: (string | false | undefined | null)[]) {
  return args.filter(Boolean).join(" ")
}
