import multer from "multer";
import { encode } from "html-entities";

// Зарпос подверженный xss
app.post("/api/xss", multer().none(), (req, res) => {
  return res.status(200).json(req.body.text);
});

// Запрос защищенный от xss
app.post("/api/defxss", multer().none(), (req, res) => {
  return res.status(200).json(encode(req.body.text));
});
