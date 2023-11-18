import { useNavigate } from "react-router-dom";
import useChatStore from "../../zustand/ChatStore";
import useGlobalStore from "../../zustand/GlobalStore";
import ChatOptions from "./ChatOptions";

class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
    this.navigate = useNavigate();
    this.setDirectChatAccess = useChatStore().setDirectChatAccess;
    this.role = useGlobalStore().role;
    this.options = ChatOptions;
  }

  help = () => {
    const message = this.createChatBotMessage(
      `I will be redirecting you to Admin chat for more assistance 😊`
    );
    this.setChatbotMessage(message);
    this.setDirectChatAccess(true);
    if (this.role === "Client") {
      setTimeout(() => {
        this.navigate("/client/chats");
      }, 2000);
    }
  };

  else = () => {
    const message = this.createChatBotMessage(
      `I did not understand you. Please choose one of the options provided. 😊`
    );
    this.setChatbotMessage(message);
  };

  returnMain = () => {
    const message = this.createChatBotMessage(
      `Return to Main Menu: You may want to know more about:`,
      {
        widget: "options0",
        delay: 1500,
      }
    );
    this.setChatbotMessageForReturnMain(message);
  };

  returnToStep1 = () => {
    const message = this.createChatBotMessage(`Return to Previous Menu:`, {
      widget: `options1`,
      delay: 1500,
    });
    this.setChatbotMessageForReturn(message);
  };

  other = () => {
    const message = this.createChatBotMessage(
      "Type 'return' for previous menu. Require more help? Type 'help' for chat with Admin.",
      {
        delay: 2500,
      }
    );
    this.setChatbotMessage(message);
  };

  otherEnd = () => {
    const message = this.createChatBotMessage(
      "Type 'return' for previous menu. Type 'main menu' to return to Main Menu. Require more help? Type 'help' for chat with Admin.",
      {
        delay: 2500,
      }
    );
    this.setChatbotMessage(message);
  };

  step1 = (input) => {
    input = input.toLowerCase();
    const message = this.createChatBotMessage(
      `Great! You have picked ${this.options[0][input].label}`
    );
    this.setChatbotMessage(message);
  };

  step1Options = (input) => {
    input = input.toLowerCase();
    const message = this.createChatBotMessage(
      `Here are more options for ${this.options[0][input].label}`,
      {
        widget: "options1",
        delay: 1500,
      }
    );
    this.setChatbotMessage(message, input);
  };

  step2 = (input, step) => {
    input = input.toLowerCase();
    console.log(step);
    let answers = this.options;
    for (let i = 0; i <= step.length; i++) {
      if (i === 0) {
        answers = answers[step[i]];
      }
      if (answers[step[i]]) {
        answers = answers[step[i]];
        answers = answers.options;
      }
    }
    const message = this.createChatBotMessage(
      `Great! You have picked ${answers[input].label}`
    );
    this.setChatbotMessage(message, input);
  };

  step2Answers = (input, step) => {
    input = input.toLowerCase();
    console.log(step);
    let answers = this.options;
    for (let i = 0; i <= step.length; i++) {
      if (i === 0) {
        answers = answers[step[i]];
      }
      if (answers[step[i]]) {
        answers = answers[step[i]];
        answers = answers.options;
      }
    }

    answers = answers[input]["answers"];

    for (const answer of answers) {
      const message = this.createChatBotMessage(answer, {
        delay: 1500,
      });
      this.setChatbotMessage(message);
    }
  };

  step3 = (input, step) => {
    input = input.toLowerCase();
    console.log(step);
    let answers = this.options;
    for (let i = 0; i <= step.length; i++) {
      if (i === 0) {
        answers = answers[step[i]];
      }
      if (answers[step[i]]) {
        answers = answers[step[i]];
        answers = answers.options;
      }
    }
    const message = this.createChatBotMessage(
      `Great! You have picked ${answers[input].label}`
    );
    this.setChatbotMessage(message, input);
  };

  step3Options = (input, step) => {
    input = input.toLowerCase();
    const message = this.createChatBotMessage(
      `Here are more options for ${this.options[0]["1e"].options[input]?.label}`,
      {
        widget: "options2",
        delay: 1500,
      }
    );
    this.setChatbotMessage(message, input);
  };

  step3a = (input) => {
    const message = this.createChatBotMessage(
      `Here are the top 5 booked activities`,
      {
        widget: "topFiveActivities",
        delay: 1500,
      }
    );
    this.setChatbotMessage(message, input);
  };

  step3b = (input) => {
    const message = this.createChatBotMessage(
      `Here are the recent 5 booked activities:`,
      {
        widget: "recentFiveActivities",
        delay: 1500,
      }
    );
    this.setChatbotMessage(message, input);
  };

  setChatbotMessage = (message, step) => {
    if (step) {
      this.setState((state) => ({
        ...state,
        step: [...state.step, step],
        messages: [...state.messages, message],
      }));
    } else {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, message],
      }));
    }
  };

  setChatbotMessageForReturn = (message) => {
    this.setState((state) => ({
      ...state,
      step: state.step.slice(0, -1),
      messages: [...state.messages, message],
    }));
  };

  setChatbotMessageForReturnMain = (message) => {
    this.setState((state) => ({
      ...state,
      step: state.step.slice(0, 1),
      messages: [...state.messages, message],
    }));
  };
}

export default ActionProvider;
