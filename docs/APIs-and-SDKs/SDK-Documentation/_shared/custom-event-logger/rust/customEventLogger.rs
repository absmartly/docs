context.set_event_logger(Box::new(|_context, event_name, data| {
    match event_name {
        "exposure" => println!("Exposure event: {:?}", data),
        "goal" => println!("Goal tracked: {:?}", data),
        _ => {}
    }
}));
