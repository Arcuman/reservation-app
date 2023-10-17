import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { UserRepository } from './users.repository';
import { UserDocument, UserSchema } from '@app/common/models/users.schema';
import { UsersResolver } from './users.resolvers';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
