#!/usr/bin/env node

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { pdf } from 'pdf-to-img'

async function convertPdfToImages(pdfPath, outputDir, options = {}) {
  const { format = 'png', prefix = 'page-', scale = 2.0 } = options

  console.log(`📄 Processing PDF: ${pdfPath}`)
  console.log(`📁 Output directory: ${outputDir}`)

  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true })

    // Read PDF file
    const pdfBuffer = await fs.readFile(pdfPath)

    // Convert PDF to images
    const converter = await pdf(pdfBuffer, {
      scale, // Higher scale for better quality
    })

    const imagePaths = []
    let pageNum = 0

    // Process each page
    for await (const page of converter) {
      pageNum++
      console.log(`🔄 Converting page ${pageNum}...`)

      // Create filename
      const fileName = `${prefix}${String(pageNum).padStart(3, '0')}.${format}`
      const filePath = path.join(outputDir, fileName)

      // Save the image
      await fs.writeFile(filePath, page)

      imagePaths.push(filePath)
      console.log(`✅ Saved: ${fileName}`)
    }

    console.log(
      `\n✨ Successfully converted ${pageNum} pages to ${format.toUpperCase()} images`,
    )
    return {
      imagePaths,
      numPages: pageNum,
      outputDir,
      success: true,
    }
  } catch (error) {
    console.error('❌ Error converting PDF:', error.message)
    return {
      error: error.message,
      success: false,
    }
  }
}

// CLI usage
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log(
      'Usage: node pdf-to-images.mjs <pdf-path> <output-dir> [options]',
    )
    console.log('Options:')
    console.log('  --scale <number>    Scale factor (default: 2.0)')
    console.log(
      '  --format <string>   Output format: png or jpeg (default: png)',
    )
    console.log('  --prefix <string>   Filename prefix (default: page-)')
    console.log('\nExample:')
    console.log('  node pdf-to-images.mjs document.pdf ./output --scale 3.0')
    process.exit(1)
  }

  const [pdfPath, outputDir] = args

  // Parse options
  const options = {}
  for (let i = 2; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2)
      const value = args[i + 1]
      if (key === 'scale') {
        options[key] = parseFloat(value)
      } else {
        options[key] = value
      }
    }
  }

  // Run conversion
  convertPdfToImages(pdfPath, outputDir, options)
    .then((result) => {
      if (!result.success) {
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { convertPdfToImages }
