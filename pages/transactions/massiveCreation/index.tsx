import SidebarLayout from "@/components/Layout/SidebarLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import ButterMassiveLoad from "./components/ButterMassiveLoad";
import Image from "next/image";
import ButterLogo from "@/components/Layout/assets/Iso logo.png";
import LogoCocos from "@/public/static/images/logo-cocos.png";
import CocosMassiveLoad from "./components/CocosMassiveLoad";
import { useState } from "react";

const MassiveCreation = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SidebarLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-semibold self-start mb-5 uppercase">
          Carga masiva de transacciones
        </h1>
        <div className="w-full">
          {/* <Tabs defaultTab={0}>
            <Tab label="Butter">
              <ButterMassiveLoad />
            </Tab>
            <Tab label="Cocos capital">
              <CocosMassiveLoad />
            </Tab>
          </Tabs> */}
          <div className="flex justify-evenly items-center h-16">
            <div
              onClick={() => setActiveTab(0)}
              className="relative w-full flex-1 h-full object-cover hover:cursor-pointer flex items-center justify-center p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-t-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none shadow-inner"
            >
              <Image
                src={ButterLogo.src}
                className="object-scale-down h-16"
                alt="logo"
                layout="fill"
              />
            </div>
            <div
              onClick={() => setActiveTab(1)}
              className="relative w-full h-full flex-1 hover:cursor-pointer flex items-center justify-center p-4 text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-t-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none"
            >
              <Image
                src={LogoCocos.src}
                alt="logo"
                layout="fill"
                className="object-scale-down h-16"
              />
            </div>
          </div>

          <div className="flex justify-between-items-center">
            {activeTab === 0 && <ButterMassiveLoad />}
            {activeTab === 1 && <CocosMassiveLoad />}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default MassiveCreation;
