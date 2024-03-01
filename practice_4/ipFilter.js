app.get("/api/test", (req, res) => {
    const ips = JSON.parse(fs.readFileSync("ips.json", "utf8"));
    const ip = req.ip.replace(/^::ffff:/, "");
    if (ips.reject.includes(ip) && !ips.allow.includes(ip)) {
      return res.status(500).json("Your ip was blocked");
    } else if (ips.reject.includes(ip)) {
      return res.status(500).json("Your ip was blocked");
    }
    return res.status(200).json("Response");
  });