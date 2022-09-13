exp.attributes({
  // date attributes are handled as millis since epoch
  created: new Date("YYYY-MM-DDTHH:mm:ss.sssZ").getTime(),
  language: user.language, // 'en'
  price: item.price, // 10000
  authenticated: user.isAuthenticated, // true
  groups: user.groups, // [ 'returning', 'frequent_buyer' ]
});

if (
  user.language === "en" &&
  user.isAuthenticated() &&
  item.price >= 10000 && // price in cents
  user.groups.some((e) => e === "returning") &&
  exp.treatment("exp_name")
) {
  // insert treatment code here
} else {
  // insert control code here
}
