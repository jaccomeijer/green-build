import path from 'path'
import sharp from 'sharp'

export const resizeImage = async ({ inputPath, sizes }) => {

  const { dir, name } = path.parse(inputPath)
  const bareOutputPath = path.join(dir, name)

  for (const sizeName of Object.keys(sizes)) {
    sharp(inputPath)
      .resize(sizes[sizeName])
      .webp({ quality: 85 })
      .toFile(`${bareOutputPath}-${sizeName}.webp`)
  }
}
