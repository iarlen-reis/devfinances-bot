interface IGetFurstAndLastDay {
  firstDayOfMonth: Date
  lastDayOfMonth: Date
}

export const getFirstAndLastDayMonth = (): IGetFurstAndLastDay => {
  const now = new Date()

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  return { firstDayOfMonth, lastDayOfMonth }
}
