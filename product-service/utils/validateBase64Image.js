const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function validateBase64Image(image) {
    if (typeof image !== 'string' || image.trim() === '') {
        return 'Field image wajib diisi';
    }

    // Buang prefix Data URI jika ada (misal: "data:image/png;base64,")
    let cleanImage = image;
    if (cleanImage.includes(';base64,')) {
        cleanImage = cleanImage.split(';base64,').pop();
    }

    if (cleanImage.length % 4 !== 0 || !BASE64_REGEX.test(cleanImage)) {
        return 'Field image harus berupa Base64 yang valid';
    }

    const padding = cleanImage.endsWith('==') ? 2 : cleanImage.endsWith('=') ? 1 : 0;
    const decodedSize = (cleanImage.length / 4) * 3 - padding;

    if (decodedSize > MAX_IMAGE_SIZE_BYTES) {
        return 'Ukuran image maksimal 2 MB';
    }

    return null;
}

module.exports = validateBase64Image;