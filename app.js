const express = require("express");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
const bodyParser = require("body-parser");

const User = require("./models/user");
const UserService = require("./services/userService");
const UserController = require("./controllers/userController");
const UserRoutes = require("./routes/userRoutes");
const registerRoutes = require("./routes/registerRoutes");

const Status = require("./models/status");
const StatusService = require("./services/statusService");
const StatusController = require("./controllers/statusController");
const StatusRoutes = require("./routes/statusRoutes");

const Match = require("./models/match");
const MatchService = require("./services/matchService");
const MatchController = require("./controllers/matchController");
const MatchRoutes = require("./routes/matchRoutes");

const UserRole = require("./models/userRole");
const UserRoleService = require("./services/userRoleService");
const UserRoleController = require("./controllers/userRoleController");
const UserRoleRoutes = require("./routes/userRoleRoutes");

const loginController = require("./controllers/loginController");
const loginService = require("./services/loginService");
const loginRoutes = require("./routes/loginRoute");
const logoutRoutes = require("./routes/logoutRoute");

// Initialiser les services et contrôleurs
const userService = new UserService(User);
const userController = new UserController(userService);
const userRoutes = UserRoutes(userController);
const registerRoutesLog = registerRoutes(userController);

const statusService = new StatusService(Status);
const statusController = new StatusController(statusService);
const statusRoutes = StatusRoutes(statusController);

const matchService = new MatchService(Match);
const matchController = new MatchController(matchService);
const matchRoutes = MatchRoutes(matchController);

const userRoleService = new UserRoleService(UserRole);
const userRoleController = new UserRoleController(userRoleService);
const userRoleRoutes = UserRoleRoutes(userRoleController);

const loginServiceInstance = new loginService();
const loginControllerInstance = new loginController(loginServiceInstance);
const loginRoutesInstance = loginRoutes(loginControllerInstance);
const logoutRoutesInstance = logoutRoutes(loginControllerInstance);

app.use(bodyParser.json());

// Utiliser les routes
app.use("/api/users", userRoutes);
app.use("/api/userRoute", userRoleRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/login", loginRoutesInstance);
app.use("/api/logout", logoutRoutesInstance);
app.use("/api/register", registerRoutesLog);

module.exports = app;
