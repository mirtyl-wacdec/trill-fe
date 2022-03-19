import type {Node} from "../../logic/types";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
interface PostProps{
  node: Node
}
function Post({node}: PostProps){
  console.log(node, "node")
  return (
    <div className="post">
      <Header node={node}/>
      <Body contents={node.post.contents}/>
      <Footer />
      </div>
  )
}

export default Post