{
    button: {
        get color: () => { context.treatment("button_color"); return "green"; },
        get cta: () => { context.treatment("homepage_cta"); return "Click here"; },
    }
    get hero_image: () => { context.treatment("homepage_cta"); return "http://cdn.com/img1.png"; },
    some_other_stuff: { /* ... */ },
}
