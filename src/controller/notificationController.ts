import Notification from "../modal/notificationSchema";
import TelegramBot, { Message } from "node-telegram-bot-api";
import { NextFunction, Request, Response } from "express";
import axios from "axios";

class MyTelegrambot {
  public chatId: number;
  public message: Message;
  public bot: TelegramBot;
  public application_id: string;
  constructor(message: Message, bot: TelegramBot) {
    this.message = message;
    this.chatId = this.message.chat.id;
    this.bot = bot;
    this.application_id = process.env.APPLICATION_ID!;
  }

  private async addNotification(text: string): Promise<boolean> {
    try {
      const notification = await Notification.create({ notifications: text });
      return !!notification;
    } catch (error) {
      return false;
    }
  }

  private async getAllNotification(): Promise<any> {
    try {
      const notification = await Notification.find();
      if (notification) {
        const nofic = notification.map(
          (item, index) => `${index + 1}. ${item.notifications}`
        );
        const formattedList = nofic.join("\n");
        return formattedList;
      }
    } catch (error) {
      return "Notification not found.";
    }
  }

  private async ClearNotifications(): Promise<any> {
    try {
      await Notification.deleteMany();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async getReply(text: string): Promise<any> {
    try {
      const res = await axios.post("https://www.botlibre.com/rest/json/chat", {
        application: this.application_id,
        instance: "165",
        message: text,
      });
      const result = res.data.message;
      return result;
    } catch (error) {
      return "Result not found";
    }
  }

  async AnyMessag(): Promise<any> {
    const chatId = this.message.chat.id;
    const options = {
      reply_markup: {
        force_reply: true,
      },
    };

    // Start command

    if (this.message.text === "/start") {
      return this.bot.sendMessage(
        chatId,
        `Hello ${this.message.from?.first_name}`
      );
    }

    // Add notification

    if (this.message.text === "/send_notification") {
      if (this.message.from?.username !== "immdipu") {
        return this.bot.sendMessage(
          chatId,
          "You are not authorized to add notification"
        );
      }
      return this.bot.sendMessage(
        chatId,
        "Write the notification you want to send",
        options
      );
    }

    if (
      this.message.reply_to_message?.chat.username === "immdipu" &&
      this.message.reply_to_message.text ===
        "Write the notification you want to send"
    ) {
      if (!this.message.text || this.message.text == "") {
        return this.bot.sendMessage(chatId, "No message provided");
      }

      const success = await this.addNotification(this.message.text);
      if (success) {
        return this.bot.sendMessage(
          chatId,
          `Notication added successfully. You can check here https://www.showmania.xyz`
        );
      }
      if (!success) {
        return this.bot.sendMessage(chatId, "Failed to add the notification");
      }
    }

    // Delete Notification

    if (this.message.text === "/delete") {
      if (this.message.from?.username !== "immdipu") {
        return this.bot.sendMessage(
          chatId,
          "You are not authorized to add notification"
        );
      }

      const success = await this.ClearNotifications();
      if (success) {
        return this.bot.sendMessage(chatId, "All notification deleted");
      } else {
        return this.bot.sendMessage(chatId, "Failed to delete notifications");
      }
    }

    //show all notifications

    if (this.message.text === "/show_all_notification") {
      if (this.message.from?.username !== "immdipu") {
        return this.bot.sendMessage(
          chatId,
          "You are not authorized to add notification"
        );
      }
      const allNotfication = await this.getAllNotification();
      if (allNotfication) {
        return this.bot.sendMessage(chatId, allNotfication.toString());
      }
    }

    // AI reply
    if (!this.message.text || this.message.text.trim() == "") {
      return this.bot.sendMessage(chatId, "No text provided");
    }

    const reply = await this.getReply(this.message.text!);
    this.bot.sendMessage(chatId, reply);
  }
}

export default MyTelegrambot;

export const sendAllNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await Notification.find();
    if (notification) {
      const notifi = notification.map((item) => item.notifications);
      res.status(200).json(notifi);
    }
  } catch (error) {
    res.status(404).json("Notification not found");
  }
};
