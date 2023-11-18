class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    if (this.state.step[1]?.includes("1e")) {
      if (this.state.step.length === 2) {
        if (
          message.toLowerCase().trim() === "2a" ||
          message.toLowerCase().trim() === "2b" ||
          message.toLowerCase().trim() === "2c"
        ) {
          this.actionProvider.step2(message, this.state.step);
          this.actionProvider.step2Answers(message, this.state.step);
          this.actionProvider.otherEnd();
        } else if (message.toLowerCase().trim() === "2d") {
          this.actionProvider.step3Options(message, this.state.step);
        } else if (message.toLowerCase().includes("return")) {
          this.actionProvider.returnMain();
        } else if (message.toLowerCase().includes("help")) {
          this.actionProvider.help();
        } else {
          this.actionProvider.else();
        }
      }
      if (this.state.step.length === 3) {
        if (message.toLowerCase().includes("3a")) {
          this.actionProvider.step3a();
          this.actionProvider.otherEnd();
        } else if (message.toLowerCase().includes("3b")) {
          this.actionProvider.step3b();
          this.actionProvider.otherEnd();
        } else if (message.toLowerCase().includes("main menu")) {
          this.actionProvider.returnMain();
        } else if (message.toLowerCase().includes("return")) {
          this.actionProvider.returnToStep1();
        } else if (message.toLowerCase().includes("help")) {
          this.actionProvider.help();
        } else {
          this.actionProvider.else();
        }
      }
    } else {
      if (this.state.step.length === 1 && this.state.step[0] === "0") {
        if (
          message.toLowerCase().trim() === "1a" ||
          message.toLowerCase().trim() === "1b" ||
          message.toLowerCase().trim() === "1c" ||
          message.toLowerCase().trim() === "1d" ||
          message.toLowerCase().trim() === "1e"
        ) {
          this.actionProvider.step1(message);
          this.actionProvider.step1Options(message);
          this.actionProvider.other();
        } else if (message.toLowerCase().includes("help")) {
          this.actionProvider.help();
        } else {
          this.actionProvider.else();
        }
      }
      if (this.state.step.length === 2 && this.state.step[1]?.includes("1")) {
        if (
          message.toLowerCase().trim() === "2a" ||
          message.toLowerCase().trim() === "2b" ||
          (message.toLowerCase().trim() === "2c" &&
            (this.state.step[1]?.includes("1a") ||
              this.state.step[1]?.includes("1b") ||
              this.state.step[1]?.includes("1d") ||
              this.state.step[1]?.includes("1e"))) ||
          (message.toLowerCase().trim() === "2d" &&
            (this.state.step[1]?.includes("1b") ||
              this.state.step[1]?.includes("1e"))) ||
          (message.toLowerCase().trim() === "2e" &&
            this.state.step[1]?.includes("1b")) ||
          (message.toLowerCase().trim() === "2f" &&
            this.state.step[1]?.includes("1b"))
        ) {
          this.actionProvider.step2(message, this.state.step);
          this.actionProvider.step2Answers(message, this.state.step);
          this.actionProvider.otherEnd();
        } else if (message.toLowerCase().includes("return")) {
          this.actionProvider.returnMain();
        } else if (message.toLowerCase().includes("help")) {
          this.actionProvider.help();
        } else {
          this.actionProvider.else();
        }
      }
      if (this.state.step.length === 3) {
        if (message.toLowerCase().includes("main menu")) {
          this.actionProvider.returnMain();
        } else if (message.toLowerCase().includes("return")) {
          this.actionProvider.returnToStep1();
        } else if (message.toLowerCase().includes("help")) {
          this.actionProvider.help();
        } else {
          this.actionProvider.else();
        }
      }
    }
  }
}

export default MessageParser;
