mod db;
mod models;
mod commands;

use commands::accounts::*;
use commands::categories::*;
use commands::transaction::*;
use commands::reports::*;
use commands::import_data::*;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let app_dir = app.handle().path().app_data_dir()
                .expect("No se pudo obtener el directorio de datos de la app");
            std::fs::create_dir_all(&app_dir).expect("No se pudo crear el directorio de datos");
            let db_path = app_dir.join("gestor_gastos.db");
            db::init_db(db_path.to_str().unwrap()).expect("Error inicializando la base de datos");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Cuentas
            get_accounts,
            create_account,
            update_account,
            delete_account,
            
            // Categorías
            get_categories,
            create_category,
            update_category,
            delete_category,

            // Transacciones
            get_transactions,
            get_transactions_account_category,
            get_transactions_by_period,
            create_transaction,
            update_transaction,
            delete_transaction,
            process_excel,

            // Reportes
            get_period_balance,
            get_category_summary,
            get_monthly_data,
            get_dashboard_summary,
        ])
        .run(tauri::generate_context!())
        .expect("Error mientras corría la aplicación.");
}
