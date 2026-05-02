use rusqlite::{Connection, Result, params};
use once_cell::sync::OnceCell;
use std::sync::Mutex;

static DB: OnceCell<Mutex<Connection>> = OnceCell::new();

pub fn get_db() -> &'static Mutex<Connection> {
    DB.get().expect("Database not initialized")
}

pub fn init_db(db_path: &str) -> Result<()> {
    let conn = Connection::open(db_path)?;

    conn.execute_batch("PRAGMA journal_mode=WAL;")?;
    conn.execute_batch("PRAGMA foreign_keys=ON;")?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS accounts (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            name         TEXT    NOT NULL,
            balance      REAL    NOT NULL DEFAULT 0,
            created_at   TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT NOT NULL,
            category_type TEXT NOT NULL,
            icon          TEXT,
            color         TEXT
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            amount           REAL    NOT NULL,
            transaction_type TEXT    NOT NULL,
            description      TEXT,
            date             TEXT    NOT NULL,
            account_id       INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
            category_id      INTEGER REFERENCES categories(id) ON DELETE SET NULL,
            created_at       TEXT    NOT NULL
        );
        ",
    )?;

    seed_default_categories(&conn)?;

    DB.set(Mutex::new(conn))
        .map_err(|_| rusqlite::Error::InvalidParameterName("DB already initialized".into()))?;

    Ok(())
}

fn seed_default_categories(conn: &Connection) -> Result<()> {
    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM categories", [], |r| r.get(0))?;

    if count > 0 {
        return Ok(());
    }

    let defaults = vec![
        ("Sin categoría",  "income",  "",   "#888"),
        ("Sin categoría",  "expense",  "",  "#888"),
        ("Salario",        "income",  "💼", "#4CAF50"),
        ("Freelance",      "income",  "💻", "#8BC34A"),
        ("Inversiones",    "income",  "📈", "#00BCD4"),
        ("Otros ingresos", "income",  "➕", "#009688"),
        ("Alimentación",   "expense", "🍔", "#F44336"),
        ("Transporte",     "expense", "🚌", "#FF5722"),
        ("Salud",          "expense", "❤️", "#E91E63"),
        ("Educación",      "expense", "📚", "#9C27B0"),
        ("Entretenimiento","expense", "🎬", "#3F51B5"),
        ("Servicios",      "expense", "💡", "#2196F3"),
        ("Ropa",           "expense", "👗", "#00BCD4"),
        ("Otros gastos",   "expense", "📦", "#065177ff"),
    ];

    for (name, cat_type, icon, color) in defaults {
        conn.execute(
            "INSERT INTO categories (name, category_type, icon, color) VALUES (?1,?2,?3,?4)",
            params![name, cat_type, icon, color],
        )?;
    }

    Ok(())
}