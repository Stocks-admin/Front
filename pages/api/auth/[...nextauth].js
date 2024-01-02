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
            email: credentials.username,
            password: credentials.password,
          };
          // const resp = await axios.post(
          //   `https://api.butterstocks.site/auth/login`,
          //   body
          // );
          const resp = {
            status: 200,
            data: {
              user: {
                user_id: 1,
                email: "matiduraan@gmail.com",
                name: "Matias Duran",
                phone: "01138054078",
                created: "2023-12-29T03:44:19.168Z",
                updated: "2023-12-29T03:44:19.168Z",
                accessToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDIzODQ4MCwiZXhwIjoxNzA0MzI0ODgwfQ.7ctzYSVrs3JbubkTZRrDb90VajjhKmvQoqLIAQVxBSA",
                refreshToken:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJqdGkiOiJjZGM5YjE0YS0yNTUwLTQ4MmUtOWU0NS02YTI4OTkxYTA3Y2UiLCJpYXQiOjE3MDQyMzg0ODAsImV4cCI6MTcwNjgzMDQ4MH0.fJD6JPyT0Mrwm8-bvPUtbDj1ayQU87ZRprDjMwZz3tc",
              },
            },
          };

          console.log(resp);
          const user = resp?.data;
          // Si el backend retorna un objeto usuario, la autenticación fue exitosa
          if (resp.status === 200 && user) {
            return user.user;
          }
          throw new Error(
            "Ocurrio un error inesperado, vuelva a intentar en unos minutos"
          );
        } catch (error) {
          throw new Error(
            error?.response?.data?.message ||
              "Ocurrio un error inesperado, vuelva a intentar en unos minutos"
          );
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
