import LeftMenuBar from "./LeftMenuBar";
import LeftProfileCard from "./LeftProfileCard";

export default function LeftMenu({ type }: { type: "home" | "profile" }) {
  return <div className="flex flex-col gap-5 text-white">{type === "home" && <LeftProfileCard />}<LeftMenuBar /></div>;
}
