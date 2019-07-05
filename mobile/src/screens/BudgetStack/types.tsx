import {
  GetBudgets_budget_budgetCategories,
  GetBudgets_budget_budgetCategories_budgetItems,
  GetBudgets_budget_budgetCategories_budgetItems_budgetItemExpenses,
} from "./Budgets/__generated__/GetBudgets";

export interface BudgetCategory extends GetBudgets_budget_budgetCategories {}
export interface BudgetItem
  extends GetBudgets_budget_budgetCategories_budgetItems {}
export interface BudgetItemExpense
  extends GetBudgets_budget_budgetCategories_budgetItems_budgetItemExpenses {}
