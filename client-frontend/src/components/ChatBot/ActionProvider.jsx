import { useNavigate } from "react-router-dom";
import useChatStore from "../../zustand/ChatStore";
import useGlobalStore from "../../zustand/GlobalStore";

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
    this.options = {
      0: {
        "1a": "1a) About Gleek",
        "1b": "1b) My Account Settings",
        "1c": "1c) Checkout Process",
        "1d": "1d) Loyalty Program",
        "1e": "1e) Shopping for Activities",
      },
    };
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

  step0 = (input) => {
    input = input.toLowerCase();
    const message = this.createChatBotMessage(
      `Great! You have picked ${input}, ${this.options[0][input]}`
    );
    this.setChatbotMessage(message, input);
  };

  setChatbotMessage = (message, step) => {
    console.log(step);
    if (step) {
      this.setState((state) => ({
        ...state,
        step: step,
        messages: [...state.messages, message],
      }));
    } else {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, message],
      }));
    }
  };
}

export default ActionProvider;
