import multer from 'multer';
import { FileFilterCallback } from 'multer';
import path from 'path';
import { Express, Request } from 'express';
import { MediaTypeError } from '../../errors/MediaTypeError';

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../../client/public'),
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const extension = path.extname(file.originalname);
        let filename = Date.now() + extension;
        cb(null, filename);
    }
});

function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        const error = new MediaTypeError('Error: Images Only!');
        cb(error);
    }
}

const oneMb = 1000000;

export const upload = multer({
    storage,
    limits: { fileSize: oneMb },
    fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        checkFileType(file, cb);
    }
}).single('picture');




export default multer({ storage });


