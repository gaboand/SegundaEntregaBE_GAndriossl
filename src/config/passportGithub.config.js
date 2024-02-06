import passport from "passport";
import User from "../dao/models/user.model.js";
import GitHubStrategy from "passport-github2";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const initializePassportGH = () => {
    passport.use(
      "github",
      new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        scope: ["user:email"]
      }, async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error("Tu cuenta de GitHub no tiene un correo electrónico público"), null);
        }
            let user = await User.findOne({ email: email })
            if (!user) {
              const newUser = {
                first_name: profile.displayName.split(" ")[0],
                last_name: profile.displayName.split(" ")[1],
                email: profile?.emails[0]?.value,
                age: 18,
                password: Math.random().toString(36).substring(7),
              };
              let result = await User.create(newUser);
              done(null, result);
            } else {
              done(null, user);
            }
          } catch (err) {
            done(err, null);
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
  
    passport.deserializeUser(async (id, done) => {
      try {
        let user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
  };
  
  export default initializePassportGH;