// Previene la consola en windows en modo release, NO BORRAR!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    gestor_gastos_lib::run()
}
