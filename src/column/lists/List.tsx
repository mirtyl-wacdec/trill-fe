interface ListProps {
  list: {
    description: string;
    members: string[];
    name: string;
    symbol: string;
    public: boolean;
  };
}

function List({ list }: ListProps) {
  return (
    <div className="list">
      <h4>{list.name}</h4>
      <p>{list.description}</p>
      <p>{list.members.length} members</p>
    </div>
  );
}

export default List;
