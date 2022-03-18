import {useParams} from "react-router-dom";

function User(){
  const p = useParams();
  return(
    <div id="main">
      <p>User</p>
      <p>{JSON.stringify(p)}</p>
      </div>
  )
}

export default User;