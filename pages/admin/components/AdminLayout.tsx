import Image from "next/image";
import ButterLogo from "@/components/Layout/assets/Iso.png";
import Link from "next/link";
import { useRouter } from "next/router";

interface IProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: IProps) => {
  const router = useRouter();

  return (
    <div className="relative">
      <aside className="z-40 h-screen w-40 fixed left-0 top-0 bg-gray-800 py-5 px-3 flex flex-col overflow-hidden">
        <div className="flex-1">
          <div className="flex w-full items-center justify-center mb-4 rounded-full">
            <Link href={"/wallet"}>
              <Image src={ButterLogo.src} alt="logo" width={64} height={64} />
            </Link>
          </div>
          <nav className="flex flex-col text-sm text-gray-400">
            <Link
              href="/admin/stocks"
              className={`py-2 hover:text-white ${
                router.asPath.includes("/stocks") && "text-white"
              }`}
            >
              Stocks
            </Link>
            <Link
              href="#"
              className={`py-2 hover:text-white ${
                router.asPath.includes("/users") && "text-white"
              }`}
            >
              Users
            </Link>
            <Link
              href="#"
              className={`py-2 hover:text-white ${
                router.asPath.includes("/products") && "text-white"
              }`}
            >
              Products
            </Link>
            <Link
              href="#"
              className={`py-2 hover:text-white ${
                router.asPath.includes("/Orders") && "text-white"
              }`}
            >
              Orders
            </Link>
            <Link
              href="#"
              className={`py-2 hover:text-white ${
                router.asPath.includes("/Settings") && "text-white"
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </aside>
      <div className="ml-40">
        <div className="container mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
