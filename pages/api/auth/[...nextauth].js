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
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
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
          const resp = await axios.post(
            `https://api.butterstocks.site/auth/login`,
            body
          );

          // Si el backend retorna un objeto usuario, la autenticación fue exitosa
          if (resp.status === 200) {
            const { user } = resp?.data;
            return user;
          } else {
            throw new Error(
              "Ocurrio un error inesperado, vuelva a intentar en unos minutos"
            );
          }
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
