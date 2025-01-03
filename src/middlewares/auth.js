const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked");
  const token = "asd";
  const isAdminAutharized = token === 'asd';
  if (!isAdminAutharized) {
    res.status(401).send("Unauthorized User");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("user auth is getting checked");
  const token = 'xyz';
  const isUserAutharized = token === "xyz";
  if (!isUserAutharized) {
    res.status(401).send("Unautharized request");
  } else {
    next();
  }
}

module.exports = {
  adminAuth,
  userAuth
}