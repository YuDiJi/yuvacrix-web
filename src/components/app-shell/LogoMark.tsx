import Image from "next/image";

export default function LogoMark() {
  return (
    <>
      {/* // <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xl"> */}
      {/* <Image
        src={"/logo/logo_dark.png"}
        // src={"/logo/logo_1024.png"}
        width={300}
        height={60}
        alt="YuvaCrix Logo"
        /> */}
      <Image
        src="/logo/logo_dark.png"
        alt="YuvaCrix Logo"
        width={250}
        height={50}
        priority
        className="h-auto w-auto max-h-24"
      />
      {/* // </div> */}
    </>
  );
}
