function auth(req, res, next) {
    console.log(req.session);
    if (req.session && req.session.role === "user") return next();
    else return res.sendStatus(401);
  }
  
  export default auth;