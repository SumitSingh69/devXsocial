const express = require("express");
const app = express();

app.get("/calculate", (req, res) => {
  const { num1, num2 } = req.query;
  const number1 = parseFloat(num1);
  const number2 = parseFloat(num2);
  if (number2 === 0) throw new Error("Division by zero is not allowed");
  const result = number1 / number2;
  res.send(`The result of ${number1} divided by ${number2} is ${result}`);
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
