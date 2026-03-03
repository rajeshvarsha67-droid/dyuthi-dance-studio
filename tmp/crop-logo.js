const sharp = require('sharp');
const fs = require('fs');

async function cropLogo() {
    try {
        const inputPath = 'public/images/logo-no-bg.png';
        const backupPath = 'public/images/logo-no-bg-backup.png';

        // Create a backup
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(inputPath, backupPath);
            console.log('Created backup at', backupPath);
        }

        const { width, height } = await sharp(inputPath).metadata();

        // We want to crop off the bottom part where the text is.
        // Let's assume the bottom 15% contains the text.
        const cropHeight = Math.floor(height * 0.82); // Keep top 82%

        console.log(`Original: ${width}x${height}`);
        console.log(`Cropped:  ${width}x${cropHeight}`);

        await sharp(backupPath)
            .extract({ left: 0, top: 0, width, height: cropHeight })
            .toFile(inputPath);

        console.log('Successfully cropped logo.');
    } catch (error) {
        console.error('Error cropping image:', error);
    }
}

cropLogo();
