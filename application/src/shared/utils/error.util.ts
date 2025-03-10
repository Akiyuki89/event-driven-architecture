import { Logger, ConflictException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class ErrorHandlingUtil {
  private static readonly logger = new Logger(ErrorHandlingUtil.name);

  static handlePrismaError(error: any, action: string = 'database operation'): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          this.logger.warn(`Conflict error on unique field during ${action}`);
          throw new ConflictException(`A record with a unique field already exists.`);
        case 'P2025':
          this.logger.warn(`Record not found error during ${action}`);
          throw new NotFoundException(`The requested record was not found.`);
        case 'P2016':
          this.logger.warn(`Invalid data error during ${action}`);
          throw new BadRequestException(`Invalid data provided for the requested ${action}.`);
        case 'P2003':
          this.logger.warn(`Foreign key constraint failed during ${action}`);
          throw new BadRequestException(`Invalid foreign key reference in the requested ${action}.`);
        default:
          this.logger.error(`Unexpected Prisma error during ${action}`, error);
          throw new InternalServerErrorException(`An unexpected error occurred with the database during ${action}.`);
      }
    } else if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    } else {
      this.logger.error(`Non-Prisma error during ${action}`, error);
      throw new InternalServerErrorException(`An unexpected error occurred during ${action}.`);
    }
  }
}
