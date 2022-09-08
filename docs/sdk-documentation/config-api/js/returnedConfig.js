{
    button: {
        get color: () => { exp.treatment("experiment1"); return "green"; },
        get cta: () => { exp.treatment("experiment2"); return "Click here"; },
    }
    get hero_image: () => { exp.treatment("experiment2"); return "http://cdn.com/img1.png"; },
    some_other_stuff: { /* ... */ },
}
