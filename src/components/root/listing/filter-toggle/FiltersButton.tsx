import './FiltersButton.scss'
import { RiListSettingsFill } from 'react-icons/ri'

const FiltersButton: React.FC = () => {
  return (
    <div className={`filters-btn visible `}>
      Filters <RiListSettingsFill />
    </div>
  )
}

export default FiltersButton
