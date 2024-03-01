// Запрос с защитой от инъекции
app.get("/api/os/:filename", (req, res) => {
    try {
      const filename = req.params.filename.replace(/ /g, "_");
      exec(`NUL > ${filename}.txt`, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json("Некорректное название");
        } else {
          return res.status(200).json("Response");
        }
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json(e.message);
    }
  });
  
// Запрос с инъекцией
  app.get("/api/os1/:filename", (req, res) => {
    try {
      exec(`NUL> ${req.params.filename}.txt`, (err) => {
        if (err) {
          throw new Error(err);
        }
      });
  
      return res.status(200).json("Response");
    } catch (e) {
      console.error(e);
      return res.status(500).json(e.message);
    }
  });