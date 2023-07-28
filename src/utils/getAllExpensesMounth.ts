interface IExpensesProps {
  id: string
  name: string
  amount: string
  createBy: number
  createdAt: Date
}

interface IGetAllExpensesMouth {
  allFinances: number
  allActualMonthExpenses: number
}

export const expensesFilterByMonth = (
  expenses: IExpensesProps[],
): IGetAllExpensesMouth => {
  const montyActual = new Date().getMonth()

  const allFinances = expenses.length

  const allActualMonthExpenses = expenses.filter(
    (expense) => expense.createdAt.getMonth() === montyActual,
  ).length

  return { allActualMonthExpenses, allFinances }
}
