import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MessagesService } from "./messages.service";

@Module({
  controllers: [AppController],
  providers: [MessagesService],
})
export class AppModule {}
