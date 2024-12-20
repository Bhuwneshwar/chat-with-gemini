// const express = require("express");
// const cookieParser = require("cookie-parser");
// const {
//   setupKinde,
//   protectRoute,
//   getUser,
//   GrantType,
//   jwtVerify,
// } = require("@kinde-oss/kinde-node-express");

// const app = express();
// const PORT = 3000;

// // Kinde Configuration
// const config = {
//   clientId: "f2af4516ea38440394a3f1dc88d6477b", // Replace with your Kinde client ID
//   issuerBaseUrl: "https://rebyb.kinde.com", // Replace with your Kinde domain
//   siteUrl: "http://localhost:3000", // Replace with your app URL
//   secret: "Jd7w82NnuEU3foZGFwUBsKKmR3Sz4QH3VR8mkUkJE2bVhR6YW", // Replace with your client secret
//   redirectUrl: "http://localhost:3000/callback", // Callback URL
//   scope: "openid profile email", // Permissions requested
//   grantType: GrantType.AUTHORIZATION_CODE, // Can also be CLIENT_CREDENTIALS or PKCE
//   unAuthorisedUrl: "http://localhost:3000/unauthorised", // Redirect for unauthenticated users
//   postLogoutRedirectUrl: "http://localhost:3000", // Where users go after logging out
// };

// // Middleware
// setupKinde(config, app);
// app.use(cookieParser()); // Parse cookies in incoming requests

// // Initialize JWT Verifier
// const verifier = jwtVerify(config.issuerBaseUrl);

// // Middleware: Verify JWT Token (using cookies)
// // const verifyJWTFromCookie = async (req, res, next) => {
// //   const token = req.cookies.kindeAccessToken; // Access token stored in cookies

// //   if (!token) {
// //     return res.status(401).send("Unauthorized: No token provided");
// //   }

// //   try {
// //     const decodedToken = await verifier(token);
// //     req.user = decodedToken; // Attach the decoded token to the request
// //     next(); // Proceed to the next middleware or route handler
// //   } catch (err) {
// //     console.error("JWT Verification Error:", err.message);
// //     return res.status(401).send("Unauthorized: Invalid token");
// //   }
// // };

// app.get("/some-route", verifier, (req, res) => {
//   console.log(req.user); // {id: kp:the-users-kinde-id}
// });
// // Routes

// // Home Route
// app.get("/", (req, res) => {
//   if (req.cookies.kindeAccessToken) {
//     res.send(`
//       <h1>Welcome to the Home Page</h1>
//       <p>You are authenticated!</p>
//       <a href="/profile">View Profile</a> |
//       <a href="/logout">Logout</a>
//     `);
//   } else {
//     res.send(`
//       <h1>Welcome to the Home Page</h1>
//       <p>You are not authenticated.</p>
//       <a href="/login">Sign In</a> |
//       <a href="/register">Register</a>
//     `);
//   }
// });

// // Login Route
// app.get("/login", (req, res) => {
//   res.redirect("/authorize");
// });

// // Register Route
// app.get("/register", (req, res) => {
//   res.redirect("/authorize?start=signup");
// });

// // Callback Route (Store JWT Token in Cookies)
// app.get("/callback", (req, res) => {
//   const token = req.session.kindeAccessToken; // Retrieve token from session (set by Kinde)

//   if (!token) {
//     return res.status(401).send("Authentication failed");
//   }

//   // Store the token in an HTTP-only cookie
//   res.cookie("kindeAccessToken", token, {
//     httpOnly: true, // Prevent access by JavaScript
//     secure: false, // Set to true in production (requires HTTPS)
//   });

//   res.redirect("/");
// });

// // Profile Route (Protected, JWT from Cookies)
// app.get("/profile", verifier, (req, res) => {
//   res.json({
//     id: req.user.sub, // User's ID from the decoded JWT
//     email: req.user.email,
//     name: req.user.given_name || req.user.name,
//   });
// });

// // Admin Route (Protected, JWT from Cookies)
// app.get("/admin", verifyJWTFromCookie, (req, res) => {
//   res.send(
//     `<h1>Welcome to the Admin Panel</h1><p>Hello, ${
//       req.user.given_name || req.user.name
//     }</p>`
//   );
// });

// // Logout Route (Clear Cookies)
// app.get("/logout", (req, res) => {
//   res.clearCookie("kindeAccessToken"); // Remove the access token cookie
//   res.redirect("/");
// });

// // Unauthorized Route
// app.get("/unauthorised", (req, res) => {
//   res.status(401).send("<h1>401 Unauthorized: Access Denied</h1>");
// });

// // Start the Server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require("express");
// const session = require("express-session");
const {
  setupKinde,
  protectRoute,
  getUser,
  GrantType,
} = require("@kinde-oss/kinde-node-express");
const conversation = require("./models/conversation");

require("dotenv").config();
// Initialize Express app
const app = express();
const PORT = 3000;

// app.use(
//   session({
//     secret: "ipayyou1000Minfree", // Replace with your own secret key
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set secure: true if using HTTPS
//   })
// );

// Kinde Configuration
const config = {
  clientId: "f2af4516ea38440394a3f1dc88d6477b", // Replace with your Kinde client ID
  issuerBaseUrl: "https://rebyb.kinde.com", // Replace with your Kinde domain
  siteUrl: "http://localhost:3000", // Replace with your app URL
  secret: "Jd7w82NnuEU3foZGFwUBsKKmR3Sz4QH3VR8mkUkJE2bVhR6YW", // Replace with your client secret
  redirectUrl: "http://localhost:3000/callback", // Callback URL
  scope: "openid profile email", // Permissions requested
  grantType: GrantType.AUTHORIZATION_CODE, // Can also be CLIENT_CREDENTIALS or PKCE
  unAuthorisedUrl: "http://localhost:3000/unauthorised", // Redirect for unauthenticated users
  postLogoutRedirectUrl: "http://localhost:3000", // Where users go after logging out
};

// Set up Kinde middleware
setupKinde(config, app);

// Routes

// Home Route
app.get("/", (req, res) => {
  console.log(req.session);

  if (req.session && req.session.kindeAccessToken) {
    res.send(`
      <h1>Welcome to the Home Page</h1>
      <p>You are authenticated!</p>
      <a href="/profile">View Profile</a> |
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome to the Home Page</h1>
      <p>You are not authenticated.</p>
      <a href="/login">Sign In</a> |
      <a href="/register">Register</a>
    `);
  }
});

// Login Route
app.get("/login", (req, res) => {
  console.log("login");

  res.redirect("/authorize");
});

// Register Route
app.get("/register", (req, res) => {
  console.log("register");

  res.redirect("/authorize?start=signup");
});

// Logout Route
app.get("/logout", (req, res) => {
  console.log("logout");

  // res.redirect("/logout");
});

// Callback Route
app.get("/callback", (req, res) => {
  console.log("callback");

  if (req.session && req.session.kindeAccessToken) {
    res.redirect("/profile");
  } else {
    res.status(401).send("Authentication failed");
  }
});

app.get("/isLogged", protectRoute, getUser, (req, res) => {
  console.log("isLogged");
});

// Protected Route Example
app.get("/admin", protectRoute, getUser, (req, res) => {
  res.send(`
    <h1>Welcome to the Admin Panel</h1>
    <p>Hello, ${req.user.given_name}</p>
  `);
});

// Profile Route
app.get("/profile", protectRoute, getUser, (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.given_name,
    family_name: user.family_name,
    picture: user.picture,
    user,
  });
});
app.get("/unauthorised", (req, res) => {
  console.log("unauthorised");

  // Redirect to login page if unauthorised
  res.status(401).send("<h1>401 Unauthorized: Access Denied</h1>");
});

app.get("/chat/:id?", protectRoute, getUser, async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id || req.query.id;
    console.log({ id });

    const chats = await conversation.findById(id);
    if (!chats) {
      return res.status(404).send("Chat not found");
    }

    res.send({ chats });
  } catch (error) {
    console.log(error);
  }
});

// Unauthorized Route

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
