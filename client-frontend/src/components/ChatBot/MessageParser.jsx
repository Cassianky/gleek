class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    if (this.state.step === 0) {
      if (
        message.toLowerCase().trim() === "1a" ||
        message.toLowerCase().trim() === "1b" ||
        message.toLowerCase().trim() === "1c" ||
        message.toLowerCase().trim() === "1d"
      ) {
        this.actionProvider.step0(message);
      } else if (message.toLowerCase().includes("help")) {
        console.log("help");
        this.actionProvider.help();
      } else {
        this.actionProvider.else();
      }
    }
    if (this.state.step.includes("1")) {
      if (
        message.toLowerCase().trim() === "2a" ||
        message.toLowerCase().trim() === "2b" ||
        message.toLowerCase().trim() === "2c" ||
        message.toLowerCase().trim() === "1d"
      ) {
        this.actionProvider.step0(message);
      } else if (message.toLowerCase().includes("help")) {
        console.log("help");
        this.actionProvider.help();
      } else {
        this.actionProvider.else();
      }
    }
  }
}

export default MessageParser;
