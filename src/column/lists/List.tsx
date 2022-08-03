import { Link } from "react-router-dom";
import type { ListType } from "../../logic/types";
interface ListProps {
  list: ListType;
  fake?: boolean
}

function List({ list, fake }: ListProps) {
  if (fake) return(
    <div className={`list`}>
        <div className="title">
          <h4>{list.name}</h4>
          <p>{list.description}</p>
        </div>
      <Link className="list-link" to={`/lists/members/${list.symbol}`}>
        <div className="members">
          <p>See {list.members.length} members</p>
        </div>
      </Link>
    </div>
  )
  else return (
    <div className={`list`}>
      <Link className="list-link title" to={`/lists/${list.symbol}`}>
        <div className="title">
          <h4>{list.name}</h4>
          <p>{list.description}</p>
        </div>
      </Link>
      <Link className="list-link" to={`/lists/members/${list.symbol}`}>
        <div className="members">
          <p>See {list.members.length} members</p>
        </div>
      </Link>
    </div>
  );
}

export default List;
