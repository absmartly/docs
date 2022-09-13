{
    button: {
        get color: () => { context.treatment("experiment1"); return "green"; },
        get cta: () => { context.treatment("experiment2"); return "Click here"; },
    }
    get hero_image: () => { context.treatment("experiment2"); return "http://cdn.com/img1.png"; },
    some_other_stuff: { /* ... */ },
}
