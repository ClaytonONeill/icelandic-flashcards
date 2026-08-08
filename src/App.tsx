import { useState, useEffect } from "react";
import translate from "translate";
import { faker } from "@faker-js/faker";

import "./App.css";

async function handleTranslate(): Promise<string[] | string> {
  const randomWord = faker.word.adjective() as string;
  const translatedWord = await translate(randomWord, "is");

  const icelandicResponse = await fetch(
    `https://freedictionaryapi.com/api/v1/entries/is/${translatedWord}`,
  );

  if (!icelandicResponse.ok) {
    return "ERROR";
  }
  const icelandicJson = await icelandicResponse.json();

  return [randomWord, JSON.stringify(icelandicJson, null, 2)];
}

function App() {
  const [englishWord, setEnglishWord] = useState<string | null>(null);
  const [dataString, setDataString] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    handleTranslate().then((result) => {
      const [enWord, isData] = result;
      if (!ignore) {
        setEnglishWord(enWord);
        setDataString(isData);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <p>Your word is {englishWord}</p>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          width: "95%",
        }}
      >
        <p>Icelandic data is:</p>
        <pre
          style={{
            whiteSpace: "pre-wrap", // Keeps the formatting but wraps long text
            overflowX: "auto", // Adds a horizontal scrollbar if needed
            textAlign: "left",
            background: "white",
            padding: "1rem", // Optional: gives the JSON room to breathe
            borderRadius: "4px", // Optional: softens the edges
            height: "100%",
          }}
        >
          {dataString}
        </pre>
      </div>
    </>
  );
}

export default App;
