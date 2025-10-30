import { Baby, House, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
export const Menu = () => {
  const { push } = useRouter();

  const usreh = () => {
    push("/");
  };
  const crepost = () => {
    push("/createpost");
  };

  const pro = () => {
    push("/profile");
  };
  const serc = () => {
    push("/search");
  };

  return (
    <div className="flex justify-around fixed bottom-5 left-0 right-0 text-green-400">
      <House
        className="w-[30px] h-[30px]"
        onClick={() => {
          usreh();
        }}
      />
      <Search
        className="w-[30px] h-[30px]"
        onClick={() => {
          serc();
        }}
      />
      <Plus
        onClick={() => {
          crepost();
        }}
        className="w-[30px] h-[30px]"
      />
      <Baby
        onClick={() => {
          pro();
        }}
        className="w-[30px] h-[30px]"
      />
    </div>
  );
};
