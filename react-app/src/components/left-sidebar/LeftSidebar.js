import './LeftSidebar.scss'

const LeftSidebar = (props) => {
  return (
    <div className="LeftSidebar">
      <input className="LeftSidebar__search-bar" type="text" placeholder="search name, topic"/>
    </div>
  );
}

export default LeftSidebar;