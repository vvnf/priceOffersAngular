module.exports=[
    {
        context:["/getToken","/offers","/refresh","/cityList"],
        target: "http://localhost:3000/price_offer/",
        secure:false,
        logLevel:"debug",
    }
]