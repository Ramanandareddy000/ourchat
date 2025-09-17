import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from '../models';
import { Op } from 'sequelize';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
  ) {}

  async create(message: Partial<Message>): Promise<Message> {
    return this.messageModel.create(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.findAll();
  }

  async findOneById(id: number): Promise<Message | null> {
    return this.messageModel.findByPk(id);
  }

  async findByUserId(userId: number): Promise<Message[]> {
    return this.messageModel.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
    });
  }

  async update(
    id: number,
    updateData: Partial<Message>,
  ): Promise<[number, Message[]]> {
    return this.messageModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return this.messageModel.destroy({ where: { id } });
  }
}
