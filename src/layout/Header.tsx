import { useState } from 'react';
import styles from './Header.module.scss';
import GridOnIcon from '@mui/icons-material/GridOn';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from 'src/UI/Button';

export default function Header() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleIsActive = (buttonName: string) => {
    setActiveButton(buttonName);
  };
  return (
    <div className={styles.header}>
      <div className={styles.containerNavigation}>
        <GridOnIcon className={styles.GridOnIcon} />
        <ReplyIcon className={styles.ReplyIcon} />
        <Button isActive={activeButton === 'Просмотр'} onClick={() => handleIsActive('Просмотр')}>
          Просмотр
        </Button>
        <Button
          isActive={activeButton === 'Управление'}
          onClick={() => handleIsActive('Управление')}>
          Управление
        </Button>
      </div>
      <div className={styles.containerNameProject}>
        <div className={styles.nameProject}>
          <p className={styles.name}>Название проекта</p>
          <p className={styles.abbreviation}>Аббревиатура</p>
          <ExpandMoreIcon className={styles.expandMoreIcon} />
        </div>
        <div className={styles.tabs}>
          <p className={styles.tab}>Строительно-монтажные работы</p>
        </div>
      </div>
    </div>
  );
}
