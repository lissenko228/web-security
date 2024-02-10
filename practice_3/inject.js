app.get("/api/inject", async (req, res) => {
  try {
    const { id } = req.query;
    const [result] = await dbTogether.query(`SELECT id, name FROM users WHERE id = ${id}`);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
});

app.get("/api/notinject", async (req, res) => {
  try {
    const { id } = req.query;
    const [result] = await dbTogether.query(`SELECT id, name FROM users WHERE id = :id`, {
      replacements: {
        id,
      },
    });
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
});
