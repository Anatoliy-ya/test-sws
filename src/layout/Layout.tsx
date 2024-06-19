import styles from './Layout.module.scss';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.containerSideBar}>
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
