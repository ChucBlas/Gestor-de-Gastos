use rusqlite::params;
use tauri::command;
use crate::db::get_db;
use crate::models::{Category, CreateCategory, UpdateCategory};

#[command]
pub fn get_categories() -> Result<Vec<Category>, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;
    let mut stmt = db
        .prepare("SELECT id, name, category_type, icon, color FROM categories ORDER BY category_type, name")
        .map_err(|e| e.to_string())?;

    let categories = stmt
        .query_map([], |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                category_type: row.get(2)?,
                icon: row.get(3)?,
                color: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(categories)
}

#[command]
pub fn create_category(data: CreateCategory) -> Result<Category, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    db.execute(
        "INSERT INTO categories (name, category_type, icon, color) VALUES (?1,?2,?3,?4)",
        params![data.name, data.category_type, data.icon, data.color],
    )
    .map_err(|e| e.to_string())?;

    let id = db.last_insert_rowid();
    get_category_by_id(&db, id)
}

#[command]
pub fn update_category(id: i64, data: UpdateCategory) -> Result<Category, String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    if let Some(name) = &data.name {
        db.execute(
            "UPDATE categories SET name = ?1, category_type = ?2, icon = ?3, color = ?4 WHERE id = ?5",
            params![name, data.category_type, data.icon, data.color, id],
        )
        .map_err(|e| e.to_string())?;
    }

    get_category_by_id(&db, id)
}

#[command]
pub fn delete_category(id: i64) -> Result<(), String> {
    let db = get_db().lock().map_err(|e| e.to_string())?;

    // Previene borrar "Sin categoría"
    let name: String = db.query_row(
        "SELECT name FROM categories WHERE id = ?1",
        params![id],
        |r| r.get(0),
    ).map_err(|e| e.to_string())?;

    if name == "Sin categoría" {
        return Err("No se puede eliminar la categoría predeterminada".to_string());
    }

    db.execute("DELETE FROM categories WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn get_category_by_id(db: &rusqlite::Connection, id: i64) -> Result<Category, String> {
    db.query_row(
        "SELECT id, name, category_type, icon, color FROM categories WHERE id = ?1",
        params![id],
        |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                category_type: row.get(2)?,
                icon: row.get(3)?,
                color: row.get(4)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}
