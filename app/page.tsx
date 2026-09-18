import AddPost from "./components/AddPost";
import Feed from "./components/feed/Feed";
import LeftMenu from "./components/leftMenu/LeftMenu";
import RightMenu from "./components/rightMenu/RightMenu";
import Stories from "./components/Stories";

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[240px_minmax(0,680px)_300px] xl:justify-center">
      <aside className="hidden xl:block"><div className="sticky top-21"><LeftMenu type="home" /></div></aside>
      <div className="min-w-0 space-y-5"><Stories /><AddPost /><Feed /></div>
      <aside className="hidden lg:block"><div className="sticky top-21"><RightMenu /></div></aside>
    </div>
  );
}
