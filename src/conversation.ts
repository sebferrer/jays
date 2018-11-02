import { MessageBox } from "./message_box";

export class Conversation {
	public messages: Array<MessageBox>;

	constructor(messages: Array<MessageBox>) {
		this.messages = messages;
	}
}