use rusqlite::params;
use tauri::command;
use crate::{db::get_db, models::{CreateTransaction, Transaction, UpdateTransaction}};
use chrono::Utc;

fn row_to_transaction(row: &rusqlite::Row) -> rusqlite::Result<Transaction> {
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
}

const TRANSACTION_SELECT: &str = "
    SELECT t.id, t.amount, t.transaction_type, t.description, t.date,
           t.account_id, a.name, t.category_id, c.name, t.created_at
    FROM transactions t
    JOIN accounts a ON a.id = t.account_id
    LEFT JOIN categories c ON c.id = t.category_id
";

#[command]
pub fn get_transactions(limit: Option<i64>) -> Result<Vec<Transaction>, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let lim = limit.unwrap_or(100);
    let sql = format!("{} ORDER BY t.date DESC, t.created_at DESC LIMIT ?1", TRANSACTION_SELECT);

    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;
    let txs = stmt
        .query_map(params![lim], row_to_transaction)
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(txs)
}

#[command]
pub fn get_transactions_account_category(account: Option<i32>, category: Option<i32>, limit: Option<i64>) -> Result<Vec<Transaction>, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let lim = limit.unwrap_or(100);
    let sql = format!("{} WHERE (?1 IS NULL OR account_id = ?1) AND (?2 IS NULL OR category_id = ?2)
    ORDER BY t.date DESC, t.created_at DESC LIMIT ?3", TRANSACTION_SELECT);

    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;
    let txs = stmt.query_map(params![account, category, lim], row_to_transaction)
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(txs)
}

#[command]
pub fn get_transactions_by_period(
    date_from: String,
    date_to: String,
) -> Result<Vec<Transaction>, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let sql = format!(
        "{} WHERE t.date >= ?1 AND t.date <= ?2 ORDER BY t.date DESC",
        TRANSACTION_SELECT
    );

    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;
    let txs = stmt
        .query_map(params![date_from, date_to], row_to_transaction)
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(txs)
}

#[command]
pub fn create_transaction(data: CreateTransaction) -> Result<Transaction, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();

    db.execute(
        "INSERT INTO transactions (amount, transaction_type, description, date, account_id, category_id, created_at)
         VALUES (?1,?2,?3,?4,?5,?6,?7)",
        params![
            data.amount, data.transaction_type, data.description,
            data.date, data.account_id, data.category_id, now
        ],
    )
    .map_err(|e| e.to_string())?;

    // Actualizar balance de la cuenta
    let sign: f64 = match data.transaction_type.as_str() {
        "income" => 1.0,
        "expense" => -1.0,
        _ => 0.0,
    };
    db.execute(
        "UPDATE accounts SET balance = balance + ?1 WHERE id = ?2",
        params![sign * data.amount, data.account_id],
    )
    .map_err(|e| e.to_string())?;

    let id = db.last_insert_rowid();
    let sql = format!("{} WHERE t.id = ?1", TRANSACTION_SELECT);
    db.query_row(&sql, params![id], row_to_transaction)
        .map_err(|e| e.to_string())
}

#[command]
pub fn update_transaction(id: i64, data: UpdateTransaction) -> Result<Transaction, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    let (old_amount, old_type, old_account_id): (f64, String, i64) = db
        .query_row(
            "SELECT amount, transaction_type, account_id FROM transactions WHERE id = ?1",
            params![id],
            |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)),
        )
        .map_err(|e| e.to_string())?;

    let revert_sign: f64 = match old_type.as_str() {
        "income" => -1.0,
        "expense" => 1.0,
        _ => 0.0,
    };
    db.execute(
        "UPDATE accounts SET balance = balance + ?1 WHERE id = ?2",
        params![revert_sign * old_amount, old_account_id],
    )
    .map_err(|e| e.to_string())?;

    db.execute(
        "UPDATE transactions SET amount=?1, transaction_type=?2, description=?3, date=?4, account_id=?5, category_id=?6 WHERE id=?7",
        params![data.amount, data.transaction_type, data.description, data.date, data.account_id, data.category_id, id],
    )
    .map_err(|e| e.to_string())?;

    let new_sign: f64 = match data.transaction_type.as_str() {
        "income" => 1.0,
        "expense" => -1.0,
        _ => 0.0,
    };
    db.execute(
        "UPDATE accounts SET balance = balance + ?1 WHERE id = ?2",
        params![new_sign * data.amount, data.account_id],
    )
    .map_err(|e| e.to_string())?;

    let sql = format!("{} WHERE t.id = ?1", TRANSACTION_SELECT);
    db.query_row(&sql, params![id], row_to_transaction)
        .map_err(|e| e.to_string())
}

#[command]
pub fn delete_transaction(id: i64) -> Result<(), String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    // Revertir balance antes de eliminar
    let (amount, tx_type, account_id): (f64, String, i64) = db
        .query_row(
            "SELECT amount, transaction_type, account_id FROM transactions WHERE id = ?1",
            params![id],
            |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)),
        )
        .map_err(|e| e.to_string())?;

    let sign: f64 = match tx_type.as_str() {
        "income" => -1.0,
        "expense" => 1.0,
        _ => 0.0,
    };
    db.execute(
        "UPDATE accounts SET balance = balance + ?1 WHERE id = ?2",
        params![sign * amount, account_id],
    )
    .map_err(|e| e.to_string())?;

    db.execute("DELETE FROM transactions WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
