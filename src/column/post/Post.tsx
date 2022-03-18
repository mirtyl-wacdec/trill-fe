import type {Poast} from "../../logic/types";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
interface PostProps{
  post: Poast
}
function Post({post}){
  return (
    <div className="post">
      <Header />
      <Body />
      <Footer />
      </div>
  )
}

export default Post