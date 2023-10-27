import { Router, Request, Response, NextFunction } from 'express';
import { PictureService } from '../services/PictureService';
import { statusCodes } from '../../../../utils/constants/status-codes';
import { loginMiddleware,
    verifyJWT,
    notLoggedIn } from '../../../middlewares/auth';
import { upload } from '../../../middlewares/multer';
  
export const router = Router();

router.post('/', 
    verifyJWT,
    upload, 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const picture = await PictureService.uploadPicture(req.userId!, req.file, req.body.tag);
            res.status(statusCodes.CREATED).json(picture);
        } catch (error) {
            next(error);
        }
    }
);

router.put('/likes/:id', 
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await PictureService.toggleLike(req.userId!,req.params.id);
            res.status(statusCodes.SUCCESS).end();
        } catch (error) {
            next(error);
        }
    }
);

router.get('/top',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pictures = await PictureService.getTopPictures();
            res.status(statusCodes.SUCCESS).json(pictures);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/following',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pictures = await PictureService.getFollowingPictures(req.userId!);
            res.status(statusCodes.SUCCESS).json(pictures);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:id',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const picture = await PictureService.getPicture(req.params.id);
            res.status(statusCodes.SUCCESS).json(picture);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/tag/',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tag = req.body.tag;
            const pictures = await PictureService.getPicturesByTag(tag);
            res.status(statusCodes.SUCCESS).json(pictures);
        } catch (error) {
            next(error);
        }
    }
);
router.get('/user/:id',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const picture = await PictureService.getPicturesByUserID(req.params.id);
            res.status(statusCodes.SUCCESS).json(picture);
        } catch (error) {
            next(error);
        }
    }
);
