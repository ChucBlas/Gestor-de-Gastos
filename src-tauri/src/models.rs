use serde::{Deserialize, Serialize};

// Cuentas 

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Account {
    pub id: i64,
    pub name: String,
    pub balance: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateAccount {
    pub name: String,
    pub initial_balance: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateAccount {
    pub name: Option<String>,
    pub new_balance: f64,
}

// Categorías

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub category_type: String, // expense | income
    pub icon: Option<String>,
    pub color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCategory {
    pub name: String,
    pub category_type: String, // expense | income
    pub icon: Option<String>,
    pub color: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCategory {
    pub name: Option<String>,
    pub category_type: String, // expense | income
    pub icon: Option<String>,
    pub color: Option<String>,
}

// Transacciones 

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Transaction {
    pub id: i64,
    pub amount: f64,
    pub transaction_type: String, // expense | income
    pub description: Option<String>,
    pub date: String,
    pub account_id: i64,
    pub account_name: Option<String>,
    pub category_id: Option<i64>,
    pub category_name: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateTransaction {
    pub amount: f64,
    pub transaction_type: String,
    pub description: Option<String>,
    pub date: String,
    pub account_id: i64,
    pub category_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateTransaction {
    pub amount: f64,
    pub transaction_type: String,
    pub description: Option<String>,
    pub date: String,
    pub account_id: i64,
    pub category_id: Option<i64>,
}

// Reportes 

#[derive(Debug, Serialize, Deserialize)]
pub struct PeriodBalance {
    pub total_income: f64,
    pub total_expense: f64,
    pub net: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategorySummary {
    pub category_name: String,
    pub category_type: String,
    pub color: Option<String>,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MonthlyData {
    pub month: String, // "2025-03"
    pub income: f64,
    pub expense: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardSummary {
    pub total_balance: f64,
    pub month_income: f64,
    pub month_expense: f64,
    pub recent_transactions: Vec<Transaction>,
}
