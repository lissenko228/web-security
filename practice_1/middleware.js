class MiddlewareController {
  async user(req, res, next) {
    try {
      const auth = req.headers["authorization"];
      const token = auth && auth.split(" ")[1];

      if (token == null) return res.status(401).end();

      jwt.verify(token, SECRET, async (err, user) => {
        if (err) return res.status(403).end();

        let authorized = await User.scope("country").findByPk(user.id);
        if (!authorized) return res.status(403).end();

        const roles = await authorized.getRoles({ joinTableAttributes: [] });
        authorized.dataValues.roles = roles;

        [authorized] = await usersStatuses([authorized]);

        req.user = authorized;
        return next();
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json(e);
    }
  }
  async admin(req, res, next) {
    try {
      const auth = req.headers["authorization"];
      const token = auth && auth.split(" ")[1];

      if (token == null) return res.status(401).end();

      jwt.verify(token, SECRET, async (err, user) => {
        if (err) return res.status(403).end();

        let authorized = await User.findByPk(user.id);
        if (!authorized) return res.status(403).end();

        const roles = await authorized.getRoles({ joinTableAttributes: [] });
        authorized.dataValues.roles = roles;

        [authorized] = await usersStatuses([authorized]);

        if (!roles.map((x) => x.accessLevel).includes(1)) return res.status(403).end();
        req.user = authorized;
        return next();
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json(e);
    }
  }
}
