const colors = require('colors');
let t = 0;
process.on("SIGINT", function () {
    //graceful shutdown
    console.log('exit' + 'ante'.gray);
    process.exit();
  });

setInterval(()=>{
    t += 1000;
    console.log(t);
}, 1000)