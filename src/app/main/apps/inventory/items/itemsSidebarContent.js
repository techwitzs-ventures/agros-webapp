import { Outlet } from 'react-router-dom';

function ItemsSidebarContent(props) {
  return (
    <div className="flex flex-col flex-auto">
      <Outlet />
    </div>
  );
}

export default ItemsSidebarContent;
