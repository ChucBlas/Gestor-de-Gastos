use rusqlite::params;
use tauri::command;
use crate::db::get_db;
use crate::models::{Account, CreateAccount, UpdateAccount};
use chrono::Utc;

#[command]
pub fn get_accounts() -> Result<Vec<Account>, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let mut stmt = db
        .prepare(
            "SELECT id, name, balance, created_at FROM accounts ORDER BY created_at ASC",
        )
        .map_err(|e| e.to_string())?;

    let accounts = stmt
        .query_map([], |row| {
            Ok(Account {
                id: row.get(0)?,
                name: row.get(1)?,
                balance: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(accounts)
}

#[command]
pub fn create_account(data: CreateAccount) -> Result<Account, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();

    db.execute(
        "INSERT INTO accounts (name, balance, created_at) VALUES (?1,?2,?3)",
        params![data.name, data.initial_balance, now],
    )
    .map_err(|e| e.to_string())?;

    let id = db.last_insert_rowid();
    get_account_by_id(&db, id)
}

#[command]
pub fn update_account(id: i64, data: UpdateAccount) -> Result<Account, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    if let Some(name) = &data.name {
        db.execute("UPDATE accounts SET name = ?1, balance = ?2 WHERE id = ?3", params![name, data.new_balance, id])
            .map_err(|e| e.to_string())?;
    }

    get_account_by_id(&db, id)
}

#[command]
pub fn delete_account(id: i64) -> Result<(), String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    db.execute("DELETE FROM accounts WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn get_account_by_id(conn: &rusqlite::Connection, id: i64) -> Result<Account, String> {
    conn.query_row(
        "SELECT id, name, balance, created_at FROM accounts WHERE id = ?1",
        params![id],
        |row| {
            Ok(Account {
                id: row.get(0)?,
                name: row.get(1)?,
                balance: row.get(2)?,
                created_at: row.get(3)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}
