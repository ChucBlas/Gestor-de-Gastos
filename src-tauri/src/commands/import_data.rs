use std::{collections::HashSet, io::Cursor};

use calamine::{Data, DataType, Reader, open_workbook_auto_from_rs};
use tauri::command;

use crate::{commands::{accounts::{self, get_accounts}, categories::{self, get_categories}, transaction::create_transaction,}, models::{CreateAccount, CreateCategory, CreateTransaction, Transaction}};

fn load_transactions(cursor: Cursor<Vec<u8>>, path_file: String, type_transaction: String) -> Result<Vec<Transaction>, String> {

    let mut new_accounts: HashSet<String> = HashSet::new();
    let mut new_categories: HashSet<String> = HashSet::new();
    let mut transactions: Vec<(String, String, CreateTransaction)> = vec![];

    match path_file.split(".").collect::<Vec<&str>>().last() {
        Some(&"csv") => {
            parse_csv(cursor, &mut new_accounts, &mut new_categories, &mut transactions, type_transaction.to_string())        
        }
        Some(&"xlsx") | Some(&"xls") => {
            parse_excel(cursor, &mut new_accounts, &mut new_categories, &mut transactions, type_transaction.to_string())
        }
        _ => {
            return Err("El archivo no es un Excel".to_string());
        }
    }?; 

    let existing_accounts = accounts::get_accounts()?;
    let mut existing_accounts_names: HashSet<String> = HashSet::new();

    for account in existing_accounts {
        existing_accounts_names.insert(account.name.to_lowercase());
    }

    let mut accounts_to_create: Vec<String> = vec![];
    for new_account in new_accounts {
        if !existing_accounts_names.contains(&new_account.to_lowercase()) {
            accounts_to_create.push(new_account);
        }
    }    

    for account in accounts_to_create {
        accounts::create_account(CreateAccount {
            name: account,
            initial_balance: 0.0,
        })?;
    }

    let existing_categories = get_categories()?;
    let mut existing_categories_names: HashSet<String> = HashSet::new();

    for category in existing_categories {
        existing_categories_names.insert(category.name.to_lowercase());
    }

    let mut categories_to_create: Vec<String> = vec![];
    for new_category in new_categories {
        if !existing_categories_names.contains(&new_category.to_lowercase()) {
            categories_to_create.push(new_category);
        }
    }    

    for category in categories_to_create {
        categories::create_category(CreateCategory{
            name: category,
            category_type: type_transaction.to_string(),
            icon: None,
            color: None,
        })?;
    }

    let all_account = get_accounts()?;
    let all_categories = get_categories()?;

    for transaction in transactions.iter_mut() {
        let mut account_id = 0;
        for account in all_account.iter().by_ref() {
            if account.name.to_lowercase() == transaction.0.to_lowercase() {
                account_id = account.id;
            }
        }
        let mut category_id = 0;
        for category in all_categories.iter().by_ref() {
            if category.name.to_lowercase() == transaction.1.to_lowercase() {
                category_id = category.id;
            }
        }
        transaction.2.account_id = account_id;
        transaction.2.category_id = Some(category_id);
        create_transaction(transaction.2.clone())?;
    }

    Ok(vec![])
}

fn format_record(cell: &Data) -> String {
    let mut res = String::new();
    if cell.is_datetime() {
        if cell.is_datetime() {
            let excel_date = cell.get_datetime().unwrap();
            let fields_of_date = excel_date.to_ymd_hms_milli();
            let year = fields_of_date.0;
            let month = fields_of_date.1;
            let day = fields_of_date.2;
            res = format!("{:04}-{:02}-{:02}", year, month, day);
        }
        res
    } else {
        cell.to_string()
    }
}

fn format_date(date: String) -> String {
    if date.contains("-") {
        date
    } else {
        let split: Vec<&str> = date.split("/").collect();
        let year = split[2].parse::<u16>().unwrap();
        let month = split[1].parse::<u8>().unwrap();
        let day = split[0].parse::<u8>().unwrap();
        let res = format!("{:02}-{:02}-{:04}", day, month, year);
        res
    }
}

#[command]
pub fn process_excel(datos: Vec<u8>, path: String, type_transaction: String) -> Result<Vec<Transaction>, String> {
    let cursor = Cursor::new(datos);

    let transactions = load_transactions(cursor, path, type_transaction)?;
    Ok(transactions)
}

fn parse_csv(cursor: Cursor<Vec<u8>>, new_accounts: &mut HashSet<String>, new_categories: &mut HashSet<String>, transactions: &mut Vec<(String, String, CreateTransaction)>, type_transaction: String) -> Result<(), String> {
    let mut csv_file = csv::Reader::from_reader(cursor);

    for (i, row) in csv_file.records().enumerate() {
        if i == 0 {
            continue;
        }
        if let Ok(row) = row {
            let account = row.get(2).unwrap().to_string();
            new_accounts.insert(account.to_string());
            
            let category = row.get(1).unwrap().to_string();
            new_categories.insert(category.to_string());
            
            let transaction = CreateTransaction {
                amount: row.get(3).unwrap().parse::<f64>().unwrap(),
                transaction_type: type_transaction.clone(),
                description: Some(row.get(8).unwrap().to_string()),
                date: format_date(row.get(0).unwrap().to_string()),
                account_id: 0, 
                category_id: Some(0),
            };
            transactions.push((account, category, transaction));
        }
    };

    Ok(())
}

fn parse_excel(cursor: Cursor<Vec<u8>>, new_accounts: &mut HashSet<String>, new_categories: &mut HashSet<String>, transactions: &mut Vec<(String, String, CreateTransaction)>, type_transaction: String) -> Result<(), String> {
    let mut workbook = open_workbook_auto_from_rs(cursor).map_err(|e| format!("Error al abrir el Excel: {}", e))?;
    let sheet_name = workbook.sheet_names()[0].clone();
    let range = workbook.worksheet_range(&sheet_name).map_err(|e| format!("No se pudo leer la hoja: {}", e))?;

    for (i, row) in range.rows().enumerate() {
        if i == 0 || i == 1 {
            continue;
        }
        let account = row[2].to_string();
        new_accounts.insert(account.to_string());
        
        let category = row[1].to_string();
        new_categories.insert(category.to_string());
        
        let transaction = CreateTransaction {
            amount: row[3].as_f64().unwrap(),
            transaction_type: type_transaction.clone(),
            description: Some(row[8].to_string()),
            date: format_record(&row[0]),
            account_id: 0,
            category_id: Some(0),  
        };
        transactions.push((account, category, transaction));
    };

    Ok(())
}