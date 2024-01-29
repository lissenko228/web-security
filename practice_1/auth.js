class UsersController {
  async auth(req, res) {
    try {
      const { email, password, rememberCheck } = req.body;
      const user = await User.scope("country").findOne({
        where: {
          email: email,
          verified: 1,
        },
      });
      if (!user) return res.status(403).end();

      if (!user.dataValues.referral) {
        await user.update({
          referral: uniqid("2-geza"),
        });
      }

      const roles = await user.getRoles({ joinTableAttributes: [] });
      user.dataValues.roles = roles;

      const decrypt = await bcrypt.compare(password, user.password);
      if (!decrypt) return res.status(403).end();
      const accessToken = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          roles: user.dataValues.roles.map((role) => role.id),
        },
        SECRET,
        {
          expiresIn: rememberCheck ? "7d" : "24h",
        }
      );
      const refreshToken = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          roles: user.dataValues.roles.map((role) => role.id),
        },
        SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.status(200).json({ user, accessToken, refreshToken });
    } catch (e) {
      console.error(e);
      return res.status(500).json(e.message);
    }
  }
}
