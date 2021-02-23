const exec = require('child_process').exec

// const ls = spawn("cd 'H:/CS 480/cart-local-server/'; npm start")

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`)
// })

// ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`)
// })

// ls.on('error', (error) => {
//   console.log(`error: ${error.message}`)
// })

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`)
// })
exec(
  "cd 'H:/CS 480/cart-local-server/'; npm start",
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  }
)
