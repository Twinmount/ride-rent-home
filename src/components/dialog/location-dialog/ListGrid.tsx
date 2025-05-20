import { StateType } from "@/types/vehicle-types";

interface ListGridProps {
  items: StateType[];
  itemsPerList?: number;
  onClick: (e: string) => void;
}

const chunkArray = (arr: StateType[], chunkSize: number): StateType[][] => {
  const chunks: StateType[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

const ListGrid: React.FC<ListGridProps> = ({
  items,
  onClick,
  itemsPerList = 5,
}) => {
  const columns = chunkArray(items, itemsPerList);

  return (
    <div className="flex flex-wrap justify-start gap-3">
      {columns.map((column, colIndex) => (
        <ul key={colIndex} className="min-w-[150px] list-none space-y-2">
          {column?.map((item: StateType) => (
            <li
              key={item?.stateId}
              className="cursor-pointer px-4 py-1 text-sm hover:text-orange"
              onClick={() => onClick(item?.stateValue)}
            >
              {item?.stateName}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default ListGrid;
