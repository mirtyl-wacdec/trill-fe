import { Link } from "react-router-dom";
import type { ListType } from "../../logic/types";
interface ListProps {
  list: ListType;
}

function List({ list }: ListProps) {
  return (
    <div className={`list`}>
      <Link className="list-link title" to={`/lists/${list.name}`}>
        <div className="title">
          <h4>{list.name}</h4>
          <p>{list.description}</p>
        </div>
      </Link>
      <Link className="list-link" to={`/lists/members/${list.name}`}>
        <div className="members">
          <p>See {list.members.length} members</p>
        </div>
      </Link>
    </div>
  );
}

export default List;
