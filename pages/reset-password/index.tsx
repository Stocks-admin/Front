import FullWidthLayout from "@/components/Layout/FullWidthLayout";
import Image from "next/image";
import Link from "next/link";
import logo from "@/components/Layout/assets/Iso logo.png";
import { useState } from "react";
import { forgotPassword } from "@/services/authServices";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendLink = async () => {
    if (!email) return setError("Email is required");
    setIsLoading(true);
    forgotPassword(email)
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setEmailSent(true);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError("An error occurred, please try again");
      });
  };

  return (
    <FullWidthLayout>
      <div className="h-screen flex flex-col justify-center items-center">
        <Link href="/" className="mx-auto">
          <Image
            src={logo.src}
            alt="Butter_logo_full"
            width={150}
            height={64}
          />
        </Link>
        <div className="mx-auto my-auto bg-gray-300 rounded-lg h-64 w-96 px-9 py-7">
          <h1 className="text-2xl text-center mb-6">Reset Password</h1>
          {!emailSent ? (
            <>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="email"
                className="border-gray-400 rounded-full p-2 w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-red-500 ml-3">{error}</p>}
              <button
                className="btn-primary w-full mt-5"
                disabled={isLoading}
                onClick={handleSendLink}
              >
                Submit
              </button>
            </>
          ) : (
            <p className="text-green-500">
              We sent an email with instructions to change your password
            </p>
          )}
        </div>
      </div>
    </FullWidthLayout>
  );
};

export default ResetPassword;
