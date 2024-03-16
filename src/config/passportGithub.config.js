import passport from "passport";
import User from "../dao/mongo/models/user.model.js";
import { CartModel } from "../dao/mongo/models/carts.model.js";
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
              return done(new Error("No se pudo obtener el correo electrónico de GitHub."), null);
            }

            let user = await User.findOne({ email: email });
            if (!user) {
              const newCart = await CartModel.create({});
              user = new User({ 
                first_name: profile.displayName.split(" ")[0] || 'GitHub User',
                last_name: profile.displayName.split(" ")[1] || '',
                email: email,
                age: 18,
                password: Math.random().toString(36).substring(7), 
                cartId: newCart._id, 
              });
              await user.save();
              return done(null, user); 
            } else {
              return done(null, user);
            }
          } catch (err) {
            return done(err, null); 
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
  
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
};

export default initializePassportGH;
