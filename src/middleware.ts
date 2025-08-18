import { chain } from "./middlewares/chain";
import withAuth from "./middlewares/withAuth";

export default chain([withAuth]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
