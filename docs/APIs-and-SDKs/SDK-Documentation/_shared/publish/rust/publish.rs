use std::sync::{mpsc, Mutex};

// Rust SDK 0.1 hands publish payloads to the event logger instead of sending them.
let (tx, rx) = mpsc::channel::<serde_json::Value>();
let tx = Mutex::new(tx);

context.set_event_logger(Box::new(move |_context, event_name, data| {
    if event_name == "publish" {
        if let Some(payload) = data {
            let _ = tx.lock().unwrap().send(payload);
        }
    }
}));

context.publish();

// Deliver each payload to the collector (PUT /context), here with the ureq crate.
for payload in rx.try_iter() {
    ureq::put("https://your-company.absmartly.io/v1/context")
        .set("X-API-Key", "YOUR-API-KEY")
        .set("X-Application", "website")
        .set("X-Application-Version", "0")
        .set("X-Environment", "production")
        .set("X-Agent", "absmartly-rust-sdk")
        .send_json(payload)?;
}
