import type { Node } from "../../logic/types";
import Sigil from "../../ui/Sigil";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
interface PostProps {
  node: Node;
  fake?: boolean;
}
function Post({ node, fake }: PostProps) {
  return (
    <div className="post">
      <div className="left">
        <div className="sigil">
          <Sigil patp={node.post.author} size={50} />
        </div>
      </div>
      <div className="right">
        <Header node={node} />
        <Body contents={node.post.contents} />
        {!fake && <Footer node={node} />}
      </div>
    </div>
  );
}

export default Post;
