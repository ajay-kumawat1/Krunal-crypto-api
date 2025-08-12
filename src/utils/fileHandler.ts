import multer from 'multer';

export const handleCoinMultipartData = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1000000 * 5 },
})


