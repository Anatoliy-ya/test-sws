import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
}
export default function Button({ children, className, isActive = false, onClick }: ButtonProps) {
  const classButton = `${styles.buttonWrapper} ${isActive && styles.active} ${className}`;
  console.log('isActive', isActive);
  return (
    <div className={classButton}>
      <button onClick={onClick}>{children}</button>
    </div>
  );
}
