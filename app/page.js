import SearchInput from "@/components/Search/page";
import Image from "next/image";
import HomePic from "./HomePic/page";
import Title from "@/components/title/page";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center h-dvh justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <HomePic />
      <Title/>
      <SearchInput />
    </div>
  );
}
