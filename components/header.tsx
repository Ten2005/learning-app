import { PRODUCT_NAME } from "@/constants";

export function Header() {
  return (
    <div className="w-screen z-50 border-b bg-background px-4 py-2 items-center ">
      <h1 className="text-end font-bolder">{PRODUCT_NAME}</h1>
    </div>
  );
}
