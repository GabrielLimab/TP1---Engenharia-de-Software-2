import { Router, Request, Response, NextFunction } from 'express';
import { TagService } from '../services/TagsService';
import { statusCodes } from '../../../../utils/constants/status-codes';
import { loginMiddleware,
    verifyJWT,
    notLoggedIn } from '../../../middlewares/auth';
import { upload } from '../../../middlewares/multer';
  
export const router = Router();


router.put('/add/:id',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tag = await TagService.addTagToPicture(req.userId!,req.params.id,req.body);
            res.status(statusCodes.CREATED).json(tag);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tags = await TagService.getTags();
            res.status(statusCodes.SUCCESS).json(tags);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:tag',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tags = await TagService.getTag(req.params.tag);
            res.status(statusCodes.SUCCESS).json(tags);
        } catch (error) {
            next(error);
        }
    }
);


