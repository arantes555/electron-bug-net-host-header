const electron = require('electron')

console.log(`ELECTRON IS RUNNING: ${process.versions.electron}\n`)

const doRequest = (path, { host } = {}) => new Promise((resolve) => {
  let done = false
  setTimeout(() => {
    if (done) return
    console.error(`/!\\ Request to ${path} TIMEOUT\n`)
    resolve()
  }, 2000)

  console.log(`Starting request to ${path} (options=${JSON.stringify({ host })})`)
  const options = {
    url: `http://localhost:30001${path}`
  }

  const request = electron.net.request(options)
  request.on('error', (err) => {
    console.log(`Request from ${path} got error ${err}\n`)
    done = true
    resolve()
  })
  request.on('response', (response) => {
    response.on('data', (chunk) => {
      console.log(`Response: ${chunk}\n`)
    })
    response.on('end', () => {
      done = true
      resolve()
    })
    response.on('error', (err) => {
      console.log(`Response from ${path} got error ${err}\n`)
      done = true
      resolve()
    })
  })
  if (host) request.setHeader('host', host)

  request.end()
})

electron.app.on('ready', async () => {
  // do requests

  const msg = Buffer.from('test')
  await doRequest('/hello')
  await doRequest('/inspect')
  await doRequest('/inspect', { host: 'test' })
  await doRequest('/inspect', { host: 'test.com' })

  process.exit(0)
})
