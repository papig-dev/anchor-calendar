// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_holidays(payload: String) -> Result<(), String> {
    let cwd = std::env::current_dir().map_err(|e| format!("failed to read cwd: {}", e))?;
    let repo_root = if cwd.file_name().and_then(|n| n.to_str()) == Some("src-tauri") {
        cwd.parent().map(std::path::Path::to_path_buf).unwrap_or(cwd.clone())
    } else {
        cwd.clone()
    };

    let mut candidate_paths = vec![
        repo_root.join("src").join("holidays.json"),
        cwd.join("holidays.json"),
    ];

    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            candidate_paths.push(exe_dir.join("holidays.json"));
            candidate_paths.push(exe_dir.join("..").join("..").join("..").join("src").join("holidays.json"));
        }
    }

    if let Some(existing) = candidate_paths.iter().find(|p| p.exists()) {
        return std::fs::write(existing, payload.as_bytes())
            .map_err(|e| format!("failed to write {}: {}", existing.display(), e));
    }

    let fallback = repo_root.join("src").join("holidays.json");
    if let Some(parent) = fallback.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| format!("failed to create dir {}: {}", parent.display(), e))?;
    }
    std::fs::write(&fallback, payload.as_bytes())
        .map_err(|e| format!("failed to write {}: {}", fallback.display(), e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, save_holidays])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
