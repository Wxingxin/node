import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

interface Message {
  id: number;
  content: string;
}

@Injectable()
export class MessagesService {
  private readonly messages = new Map<number, Message>();
  private nextId = 1;

  findAll() {
    return Array.from(this.messages.values());
  }

  findOne(id: number) {
    const message = this.messages.get(id);
    if (!message) {
      throw new NotFoundException(`Message ${id} not found`);
    }
    return message;
  }

  create(createMessageDto: CreateMessageDto) {
    const message: Message = {
      id: this.nextId++,
      //修改过了
      content: createMessageDto.content ?? "",
    };
    this.messages.set(message.id, message);
    return message;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    const existing = this.findOne(id);
    const updated: Message = {
      ...existing,
      ...updateMessageDto,
    };
    this.messages.set(id, updated);
    return updated;
  }

  remove(id: number) {
    if (!this.messages.delete(id)) {
      throw new NotFoundException(`Message ${id} not found`);
    }
  }
}
