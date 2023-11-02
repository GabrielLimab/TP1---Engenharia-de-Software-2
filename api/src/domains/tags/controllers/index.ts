import { Router, Request, Response, NextFunction } from 'express';
import { TagService } from '../services/TagsService';
import { statusCodes } from '../../../../utils/constants/status-codes';
import { verifyJWT } from '../../../middlewares/auth';
export const router = Router();

router.post('/:pictureId',
    verifyJWT,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tag = await TagService.addToPicture(req.userId!, req.params.pictureId, req.body);
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
            const tags = await TagService.getAll();
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
            const tags = await TagService.getByTagname(req.params.tag);
            res.status(statusCodes.SUCCESS).json(tags);
        } catch (error) {
            next(error);
        }
    }
);


