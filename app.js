import users from "./myjsonfile.json" assert { type: "json" };
const myArray = Object.values(users);
document.getElementById("json-content").innerHTML = Object.values(users);