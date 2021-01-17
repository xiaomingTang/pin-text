export function joinSpace(...args: string[]) {
  return args.filter(Boolean).join(" ")
}
