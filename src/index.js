import "./styles.scss";

import Artyom from "artyom.js";
const artyom = new Artyom();

function isgetReplyAvailable() {
  return typeof getReply !== "undefined" && typeof getReply === "function";
}

if (isgetReplyAvailable()) {
  let command;
  let timeoutId;
  let setIntervalTimer;

  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    button.innerHTML = "Talk now 🙂";
    setIntervalTimer = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 2;
      if (randomNumber % 2 === 0) {
        button.innerHTML = "Talk now 😮";
      } else {
        button.innerHTML = "Talk now 🙂";
      }
    }, 100);
    clearTimeout(timeoutId);

    command = "";
    timeoutId = setTimeout(() => {
      clearInterval(setIntervalTimer);
      const response = getReply(command);
      console.log(response);
      artyom.say(response);

      button.innerHTML = "Give a new command";
    }, 5000);
  });

  var UserDictation = artyom.newDictation({
    continuous: false, // Enable continuous if HTTPS connection
    onResult: function(text) {
      // Do something with the text
      if (text.length > command.length) {
        command = text;
        console.log(command);
      }
    },
    onStart: function() {
      console.log("Dictations started by the users");
    },
    onEnd: function() {
      console.log("Dictation stopped by the user");
    }
  });

  UserDictation.start();
} else {
  alert("add the getReply function!");
}



// Voice Assistant
// My code starts from here.

// To make the loged responds disappear when the button is clicked again
const timerMessageElement = document.getElementById("timerMessage");
const wikiLinkElement = document.getElementById("wikiLink");
const button = document.querySelector("button");

button.addEventListener("click", () => {
  timerMessageElement.textContent = "";
  wikiLinkElement.textContent = "";
});

let userName = "";
let toDoList = [];
let currentToDO = "";
const operators = ["+", "-", "*", "/", "x", "add", "plus", "subtract", "minus", "multiply", "divide", "divided by"];

function capitalFirstChar(strOrArr) {
  return strOrArr.charAt(0).toUpperCase() + strOrArr.slice(1);
}

function saveName(arr) {
  const newName = arr[arr.indexOf("is") + 1];
  return (userName = capitalFirstChar(newName));
}

function addToDo(newToDo) {
  toDoList.push(newToDo);
  return (currentToDO = capitalFirstChar(newToDo));
}

function getReply(command) {
  const commandArr = command.split(" ").map((word) => word.toLowerCase());
  // Name
  if (command.toLowerCase().includes("my name is")) {
    if (userName === "") {
      saveName(commandArr);
      return `Nice to meet you ${userName}`;
    } else {
      return `We've already saved your name ${userName}`;
    }
  } else if (command.toLowerCase().includes("what is my name")) {
    return `Your name is ${userName}`;
  }

  // Todo
  else if (
    commandArr.includes("add") &&
    command.toLowerCase().includes("to my")
  ) {
    const newToDo = commandArr
      .slice(commandArr.indexOf("add") + 1, commandArr.indexOf("to"))
      .join(" ");
    if (!toDoList.includes(newToDo)) {
      addToDo(newToDo);
      return `${currentToDO} added to your todo list`;
    } else {
      return `You have already add ${currentToDO} to your todo list`;
    }
  } else if (command.toLowerCase().includes("what is on my")) {
    return `You have ${toDoList.length} todos, ${toDoList.join(" and ")}`;
  }

  // Date
  else if (command.toLowerCase().includes("what day is it today")) {
    const today = new Date();
    const day = today.getDate();
    const monthIndex = today.getMonth();
    const year = today.getFullYear();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[monthIndex];

    return `Today is ${day}. of ${month} ${year}`;
  }

  // Do Math.
  else if (commandArr.some((word) => operators.includes(word))) {
    const operatorIndex = commandArr.findIndex((word) =>
      operators.includes(word)
    );
    if (operatorIndex !== -1) {
      const operator = commandArr[operatorIndex];
      const num1 = Number(commandArr.slice(operatorIndex - 1, operatorIndex));
      const num2 = Number(
        commandArr.slice(operatorIndex + 1, operatorIndex + 2)
      );
      switch (operator) {
        case "+":
        case "add":
        case "plus":
          return `${num1 + num2}`;
        case "-":
        case "subtract":
        case "minus":
          return `${num1 - num2}`;
        case "*":
        case "x":
        case "multiply":
          return `${num1 * num2}`;
        case "/":
        case "divide":
        case "divided by":
          if (num2 === 0) {
            return "You cannot divide a number by zero";
          }
          return `${(num1 / num2).toFixed(0)}`;
        default:
          return "Invalid Operator";
      }
    }
    return "Not found any operator in your question";
  }

  // Timer
  else if (command.toLowerCase().includes("set a timer for")) {
    const forIndex = commandArr.findIndex((word) => word === "for");
    if (forIndex !== -1 && forIndex < commandArr.length - 1) {
      const time = parseInt(commandArr[forIndex + 1]);
      if (
        command.toLowerCase().includes("minute") ||
        command.toLowerCase().includes("minutes") ||
        command.toLowerCase().includes("min")
      ) {
        setTimeout(() => {
          console.log("Timer done");
          document.getElementById("timerMessage").innerHTML = "Timer done";
        }, time * 60 * 1000);
        return `Timer set for ${time} minutes`;
      } else if (
        command.toLowerCase().includes("second") ||
        command.toLowerCase().includes("seconds") ||
        command.toLowerCase().includes("s")
      ) {
        setTimeout(() => {
          console.log("Timer done");
          document.getElementById("timerMessage").innerHTML = "Timer done";
        }, time * 1000);
        return `Timer set for ${time} seconds`;
      } else if (
        command.toLowerCase().includes("hour") ||
        command.toLowerCase().includes("hours") ||
        command.toLowerCase().includes("h")
      ) {
        setTimeout(() => {
          console.log("Timer done");
          document.getElementById("timerMessage").innerHTML = "Timer done";
        }, time * 3600 * 1000);
        return `Timer set for ${time} hours`;
      } else {
        return "Sorry, I couldn't recognize the time unit in your command.";
      }
    }
    return "Invalid timer command";
  }

  // Define a Word
  else if (command.toLowerCase().includes("define")) {
    const keyWord = command.substring(7);
    const wikiLink = `https://en.wikipedia.org/wiki/${keyWord.toLowerCase()}`;
    document.getElementById("wikiLink").innerHTML = `The definition of '${keyWord}' can be found here: <a href="${wikiLink}" target="_blank">${wikiLink}</a>`;
    return `The definition of '${keyWord}' can be found here: ${wikiLink}`;
  }
  return "I'm sorry, I couldn't understand your command.";
}