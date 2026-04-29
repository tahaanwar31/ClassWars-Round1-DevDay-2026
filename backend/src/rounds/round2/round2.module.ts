import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Round2Controller } from './round2.controller';
import { Round2Service } from './round2.service';
import { Team, TeamSchema } from '../../schemas/team.schema';
import { GameSession, GameSessionSchema } from '../../schemas/game-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
  ],
  controllers: [Round2Controller],
  providers: [Round2Service],
})
export class Round2Module {}
