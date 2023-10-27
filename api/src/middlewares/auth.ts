import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { prisma } from "../lib/prisma";
import { PermissionError } from '../../errors/PermissionError';
import { statusCodes } from '../../utils/constants/status-codes';
import { Request, Response, NextFunction } from 'express';
import { getEnv } from '../../utils/functions/get-env';

function generateJWT(userId: string , res: Response) {
  const body = {
    id: userId,
  };
  
  const token = sign({ user: body }, getEnv('SECRET_KEY'), { expiresIn: getEnv('JWT_EXPIRATION')});
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: getEnv('NODE_ENV') !== 'development',
  });
}

function cookieExtractor(req: Request) {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }

  return token;
}

export async function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      throw new PermissionError('Invalid e-mail and/or password.');
    }

    const matchingPassword = await compare(req.body.password, user.password);
    if (!matchingPassword) {
      throw new PermissionError('Invalid e-mail and/or password.');
    }

    generateJWT(user.id, res);

    res.status(statusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
}

export function notLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    const token = cookieExtractor(req);

    if (token) {
      const decoded = verify(token, getEnv('SECRET_KEY'));
      if (decoded) {
        throw new PermissionError('You are already logged in.');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const token = cookieExtractor(req);
    if (token) {
      const decoded = verify(token, getEnv('SECRET_KEY')) as JwtPayload;
      req.userId = decoded.user.id;
    }

    if (!req.userId) {
      throw new PermissionError(
        'You need to be logged in to access this resource.');
    }
    next();
  } catch (error) {
    next(error);
  }
}