import styles from './Footer.module.scss';

export function Footer({ homePage }: { homePage?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${homePage && styles['bg-white']}`}>
      <div className={styles.content}>
        &copy; {currentYear} by{' '}
        <a href="https://github.com/sureshHARDIYA">Suresh Kumar Mukhiya</a>. All rights
        reserved.
      </div>
    </footer>
  );
}
