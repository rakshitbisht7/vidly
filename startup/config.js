// const config = require("config");

// module.exports = function(){
//     if (!config.get("jwtPrivateKey")) {
//         throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
//       }
      
// }
module.exports = function () {
  const jwtPrivateKey = process.env.jwtPrivateKey || require("config").get("jwtPrivateKey");

  console.log("JWT Private Key:", process.env.jwtPrivateKey ? "Loaded" : "Not Found");

  if (!jwtPrivateKey) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  }
};
