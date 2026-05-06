import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

type ErrorCodesHandle = {
    [key: string]: (e?: PrismaClientKnownRequestError) => {
        getStatus: any;
        message: string;
    };
};

// https://www.prisma.io/docs/orm/reference/error-reference#error-codes
const PrismaErrors: ErrorCodesHandle = {
    P1000: () => {
        return new InternalServerErrorException();
    },
    P1001: () => {
        return new InternalServerErrorException("Can't reach database!");
    },
    P1002: () => {
        return new InternalServerErrorException();
    },
    P1003: () => {
        return new InternalServerErrorException();
    },
    P1008: () => {
        return new InternalServerErrorException();
    },
    P1009: () => {
        return new InternalServerErrorException();
    },
    P1010: () => {
        return new InternalServerErrorException();
    },
    P1011: () => {
        return new InternalServerErrorException();
    },
    P1012: () => {
        return new InternalServerErrorException();
    },
    P1013: () => {
        return new InternalServerErrorException();
    },
    P1014: () => {
        return new InternalServerErrorException();
    },
    P1015: () => {
        return new InternalServerErrorException();
    },
    P1016: () => {
        return new InternalServerErrorException();
    },
    P1017: () => {
        return new InternalServerErrorException();
    },
    P2000: () => {
        return new BadRequestException('Data too long');
    },
    P2001: () => {
        return new NotFoundException('Could not find data');
    },
    P2002: () => {
        return new UnauthorizedException('Data already exists');
    },
    P2003: () => {
        return new UnauthorizedException('Data already exists');
    },
    P2004: () => {
        return new UnauthorizedException('Data already exists');
    },
    P2005: () => {
        return new BadRequestException('Invalid data');
    },
    P2006: () => {
        return new BadRequestException('Invalid data');
    },
    P2007: () => {
        return new BadRequestException('Invalid data');
    },
    P2008: () => {
        return new InternalServerErrorException();
    },
    P2025: () => {
        return new BadRequestException(
            'An operation failed because it depends on one or more records that were required but not found. Check log for cause',
        );
    },
    // If we get a unhandled code we should implement it
    UNHANDLED: () => {
        return new InternalServerErrorException(
            'Unhandled Prisma error, please see the log',
        );
    },
};

export function getPrismaErrors(exception: PrismaClientKnownRequestError) {
    return (PrismaErrors[exception.code] ?? PrismaErrors.UNHANDLED)(exception);
}

export type PrismaHttpError = {
    statusCode: number;
    message: string;
};

/**
 * Take the `e: any` from a prisma exception. Check if is a instance
 * of `PrismaClientKnownRequestError` and execute the givent `fn` function if is the
 * case. If is not a instance of `PrismaClientKnownRequestError` it will throw the original
 * error.
 * @param e exception from `.catch`
 * @param fn function to execute if `e` is instance of `PrismaClientKnownRequestError`
 * @thorws If `e` is not instance of `PrismaClientKnownRequestError` it will simply
 * throw `e`
 * @note If you throw exception that is instance of `PrismaClientKnownRequestError`
 * in `fn` the nest filter will catch!
 * If `fn` is calld `overridePrismaFilter` will not thorw, be carefull, if you dont
 * throw in `fn` the error will not be propagate anymore
 * @example
 * // If you want to return a value in some case:
 *    const tag = await this.tagDb.findOneByNameOrTrhow(tagName).catch((e) =>
 *    overridePrismaFilter<null>(e, (err) => {
 *      if (err.code === 'P2025') {
 *        this.log.debug(`Tag ${tagName} dont exist`);
 *        return null;
 *      }
 *      throw e;
 *    })
 *  );
 *
 *  if (tag) {
 *    const errmsg = `${tag.name} already exist!`;
 *    throw new UnauthorizedException(errmsg);
 *  }
 *
 *
 * // If you juste want to put a custom error:
 * async userCreateATag(userId: number, tagName: string): Promise<number> {
 *  const tag = await this.tagDb.findOneByNameOrTrhow(tagName).catch((e) =>
 *    overridePrismaFilter(e, (err) => {
 *      if (err.code === 'P2025') {
 *        throw new NotFoundException(`Tag ${tagName} not found`);
 *      }
 *      throw e;
 *    }),
 *  );
 */
export function overridePrismaFilter<T>(
    e: any,
    fn: (prismaError: PrismaClientKnownRequestError) => T,
) {
    if (e instanceof PrismaClientKnownRequestError) {
        return fn(e);
    } else {
        throw e;
    }
}

/**
 * Catch all `PrismaClientKnownRequestError` and translate Prisma exception
 * code to http error response.
 */
@Catch(PrismaClientKnownRequestError)
export class PrismaFilter implements ExceptionFilter {
    private readonly log = new Logger(PrismaFilter.name);

    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        this.log.verbose(exception.code, exception);

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const err = getPrismaErrors(exception);

        const httpError: PrismaHttpError = {
            statusCode: err.getStatus(),
            message: `[PrismaError]: ${err.message}`,
        };

        this.log.verbose(httpError);

        response.status(httpError.statusCode).json(httpError);
    }
}
