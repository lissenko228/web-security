usersRouter.get("/test/:bearer", async (req, res) => {
  try {
    const { bearer } = req.params;

    let auth;

    await jwt.verify(bearer, SECRET, async (err, user) => {
      if (err) throwError(403, "1");

      auth = await User.scope("minAttributes").findByPk(user.id);
      if (!auth) throwError(403, "1");
    });

    return res.status(200).json(auth);
  } catch (e) {
    console.error(e);
    return res.status(e.code || 500).json(e);
  }
});
