import axios from "axios";
import moment from "moment";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 30 days
    updateAge: 60 * 55, // 55 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  // Configura uno o más proveedores de autenticación
  providers: [
    CredentialsProvider({
      // El nombre para mostrar en la interfaz de inicio de sesión
      name: "Credentials",
      // La lógica de autenticación se maneja aquí
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const body = {
            email: credentials?.username,
            password: credentials?.password,
          };
          // const resp = await axios.post(
          //   `https://api.butterstocks.site/auth/login`,
          //   body
          // );
          const resp = {
            data: {
              user: {
                user_id: 1,
                email: "matiduraan@gmail.com",
                name: "Matias Duran",
                phone: "01138054078",
                created: "2023-12-29T03:44:19.168Z",
                updated: "2023-12-29T03:44:19.168Z",
                accessToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDMyOTA0MywiZXhwIjoxNzA0NDE1NDQzfQ.buEjEtvyvCiB3f9iHdgEvLOlKokM4xkIB0xW2WWTcJM",
                refreshToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJqdGkiOiJlZGViNTlhNC00ODU2LTRlOGUtODcwYS1lMGVkOGI2NWUzN2EiLCJpYXQiOjE3MDQzMjkwNDMsImV4cCI6MTcwNjkyMTA0M30.59hvhG5QwVD2Bk5onxfAqh9ZasQ78lv_lvJ9wM8i7DQ",
              },
            },
            status: 200,
          };
          const user = resp?.data;
          // Si el backend retorna un objeto usuario, la autenticación fue exitosa
          if (resp?.status === 200 && user) {
            return user.user;
          }
          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && !token?.user_id) {
        token.user_id = user.user_id;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      } else if (
        user &&
        token?.user_id &&
        token?.exp &&
        token?.refreshToken &&
        token.exp > moment().unix()
      ) {
        const newToken = await refreshAccessToken(token.refreshToken);
        if (newToken.status === 200) {
          token.accessToken = newToken.data.accessToken;
          token.refreshToken = newToken.data.refreshToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.user_id = token.user_id;
        session.user.accessToken = token.accessToken;
      }

      return session;
    },
  },
});
