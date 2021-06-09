const fs = require('fs')
const path = require('path')

async function main() {
  const dir = path.resolve(__dirname, '..', 'static', 'videos')
  const videos = []

  fs.readdirSync(dir).forEach(file => {
    if (file.match(/\.(webm|ogg|mp4)$/i)) {
      videos.push({
        name: file.replace(/\.(webm|ogg|mp4)$/i, ''),
        url: `/videos/${file}`,
        type: `video/${file.match(/\.(webm|ogg|mp4)$/i)[1]}`
      })
    }
  })

  const dataFile = path.resolve(__dirname, '..', 'assets', 'data', 'videos.json')
  fs.writeFileSync(dataFile, JSON.stringify(videos, null, 2))
}

main().catch(console.error)
