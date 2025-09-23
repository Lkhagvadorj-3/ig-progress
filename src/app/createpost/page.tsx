"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex gap-30 p-3">
        <h1
          onClick={() => {
            router.push("/");
          }}
        >
          X
        </h1>
        <h1>New photo post</h1>
      </div>
      <div className="flex flex-col gap-2 items-center ">
        <img src="/photo.jpg" />
        <Button className="w-[250px] bg-blue-600">Photo library</Button>
        <Button
          className="w-[250px]  bg-blue-600"
          onClick={() => {
            router.push("/generatepost");
          }}
        >
          Generate with AI
        </Button>
      </div>
    </div>
  );
};
export default page;
