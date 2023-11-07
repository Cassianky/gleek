import { useTheme } from "@mui/material";
import ReactWordcloud from "react-wordcloud";
const WordCloud = ({ data }) => {
  const wordData = {};
  const theme = useTheme();

  const callbacks = {
    getWordColor: (word) => {
      if (word.sentiment === "NEGATIVE") {
        return theme.palette.error.main;
      } else if (word.sentiment === "POSITIVE") {
        return theme.palette.light_green.main;
      } else {
        return theme.palette.grey[400];
      }
    },
  };

  const options = {
    fontSizes: [20, 30],
  };

  data?.forEach((like) => {
    const word = like.word;
    const sentiment = like.sentiment;
    if (wordData[word]) {
      wordData[word].count += 1;
      wordData[word].sentiment = sentiment;
    } else {
      wordData[word] = { count: 1, sentiment };
    }
  });

  const words = Object.keys(wordData).map((word) => ({
    text: word,
    value: wordData[word].count,
    sentiment: wordData[word].sentiment,
  }));

  return (
    <ReactWordcloud words={words} callbacks={callbacks} options={options} />
  );
};

export default WordCloud;
