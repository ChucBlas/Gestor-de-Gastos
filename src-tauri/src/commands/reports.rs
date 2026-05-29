use crate::db::get_db;
use crate::models::{CategorySummary, DashboardSummary, MonthlyData, PeriodBalance, Transaction};
use rusqlite::params;
use tauri::command;

#[command]
pub fn get_period_balance(
    date_from: String,
    date_to: String,
    account_id: Option<i32>,
) -> Result<PeriodBalance, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let income: f64 = db.query_row(
        "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE transaction_type='income' AND date >= ?1 AND date <= ?2 AND (?3 IS NULL OR account_id = ?3)",
        params![date_from, date_to, account_id],
        |r| r.get(0),
    ).map_err(|e| e.to_string())?;

    let expense: f64 = db.query_row(
        "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE transaction_type='expense' AND date >= ?1 AND date <= ?2 AND (?3 IS NULL OR account_id = ?3)",
        params![date_from, date_to, account_id],
        |r| r.get(0),
    ).map_err(|e| e.to_string())?;

    Ok(PeriodBalance {
        total_income: income,
        total_expense: expense,
        net: income - expense,
    })
}

#[command]
pub fn get_category_summary(
    date_from: String,
    date_to: String,
    account_id: Option<i32>,
) -> Result<Vec<CategorySummary>, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let mut stmt = db
        .prepare(
            "SELECT c.name, c.category_type, c.color, SUM(t.amount) as total
         FROM transactions t
         JOIN categories c ON c.id = t.category_id
         WHERE t.date >= ?1 AND t.date <= ?2 AND (?3 IS NULL OR account_id = ?3)
         GROUP BY c.id ORDER BY total DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![date_from, date_to, account_id], |row| {
            Ok(CategorySummary {
                category_name: row.get(0)?,
                category_type: row.get(1)?,
                color: row.get(2)?,
                total: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(rows)
}

#[command]
pub fn get_monthly_data(year: i32, account_id: Option<i32>) -> Result<Vec<MonthlyData>, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    let mut complete_data: Vec<MonthlyData> = (1..=12)
        .map(|m| MonthlyData {
            month: format!("{:04}-{:02}", year, m),
            income: 0.0,
            expense: 0.0,
        })
        .collect();

    let year_str = format!("{}-", year);

    let mut stmt = db
        .prepare(
            "SELECT substr(date,1,7) as month,
                SUM(CASE WHEN transaction_type='income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN transaction_type='expense' THEN amount ELSE 0 END) as expense
         FROM transactions
         WHERE date LIKE ?1 AND (?2 IS NULL OR account_id = ?2)
         GROUP BY month",
        )
        .map_err(|e| e.to_string())?;

    let db_rows = stmt
        .query_map(params![format!("{}%", year_str), account_id], |row| {
            Ok(MonthlyData {
                month: row.get(0)?,
                income: row.get(1)?,
                expense: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?;

    for row_result in db_rows {
        let row_data = row_result.map_err(|e| e.to_string())?;

        if let Some(month_data) = complete_data.iter_mut().find(|m| m.month == row_data.month) {
            month_data.income = row_data.income;
            month_data.expense = row_data.expense;
        }
    }

    Ok(complete_data)
}

#[command]
pub fn get_dashboard_summary(account_id: Option<i32>) -> Result<DashboardSummary, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    let total_balance: f64 = db
        .query_row(
            "SELECT COALESCE(SUM(balance),0) FROM accounts WHERE (?1 IS NULL OR id = ?1)",
            [account_id],
            |r| r.get(0),
        )
        .map_err(|e| e.to_string())?;

    let now = chrono::Local::now();
    let month_from = format!("{}-{:02}-01", now.format("%Y"), now.format("%m"));
    let month_to = format!("{}-{:02}-31", now.format("%Y"), now.format("%m"));

    let income: f64 = db.query_row(
        "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE transaction_type='income' AND date >= ?1 AND date <= ?2 AND (?3 IS NULL OR account_id = ?3)",
        params![month_from, month_to, account_id],
        |r| r.get(0),
    ).map_err(|e| e.to_string())?;

    let expense: f64 = db.query_row(
        "SELECT COALESCE(SUM(amount),0) FROM transactions WHERE transaction_type='expense' AND date >= ?1 AND date <= ?2 AND (?3 IS NULL OR account_id = ?3)",
        params![month_from, month_to, account_id],
        |r| r.get(0),
    ).map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT t.id, t.amount, t.transaction_type, t.description, t.date,
                t.account_id, a.name, t.category_id, c.name, t.created_at
         FROM transactions t
         JOIN accounts a ON a.id = t.account_id
         LEFT JOIN categories c ON c.id = t.category_id
         WHERE (?1 IS NULL OR account_id = ?1)
         ORDER BY t.date DESC, t.created_at DESC LIMIT 10",
        )
        .map_err(|e| e.to_string())?;

    let recent = stmt
        .query_map([account_id], |row| {
            Ok(Transaction {
                id: row.get(0)?,
                amount: row.get(1)?,
                transaction_type: row.get(2)?,
                description: row.get(3)?,
                date: row.get(4)?,
                account_id: row.get(5)?,
                account_name: row.get(6)?,
                category_id: row.get(7)?,
                category_name: row.get(8)?,
                created_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(DashboardSummary {
        total_balance,
        month_income: income,
        month_expense: expense,
        recent_transactions: recent,
    })
}
