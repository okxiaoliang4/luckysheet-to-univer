// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const removeNil = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      removeNil(obj[key] as Record<string, unknown>)
    }
  })
  return obj
}
