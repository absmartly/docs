context.set_event_logger(Box::new(|ctx, event_type, data| {
    match event_type {
        "exposure" => println!("Exposure event"),
        "goal" => println!("Goal tracked"),
        "error" => eprintln!("Error: {:?}", data),
        "ready" | "refresh" | "publish" | "finalize" => {}
        _ => {}
    }
}));
