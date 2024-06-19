import styles from './Sidebar.module.scss';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.menu}>
        <p>{<ViewQuiltIcon />}По проекту</p>
        <p>{<ViewQuiltIcon />}Объекты</p>
        <p>{<ViewQuiltIcon />}РД</p>
        <p>{<ViewQuiltIcon />}МТО</p>
        <p className={styles.smr}>{<ViewQuiltIcon />}СМР</p>
        <p>{<ViewQuiltIcon />}График</p>
        <p>{<ViewQuiltIcon />}МиМ</p>
        <p>{<ViewQuiltIcon />}Рабочий</p>
        <p>{<ViewQuiltIcon />}Капвложения</p>
        <p>{<ViewQuiltIcon />}Бюджет</p>
        <p>{<ViewQuiltIcon />}Финансирование</p>
        <p>{<ViewQuiltIcon />}Панорамы</p>
        <p>{<ViewQuiltIcon />}Камеры</p>
        <p>{<ViewQuiltIcon />}Поручение</p>
        <p>{<ViewQuiltIcon />}Контрагенты</p>
      </div>
    </div>
  );
}
