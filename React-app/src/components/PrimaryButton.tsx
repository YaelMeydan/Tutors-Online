import type { PropsWithChildren } from "react";

import styles from "./PrimaryButton.module.scss";

type PrimaryButtonProps = PropsWithChildren<{
    onClick?(): void,
}>;
export function PrimaryButton({ onClick, children }: PrimaryButtonProps) {
    return <button className={styles.button} onClick={onClick}>{children}</button>;
}
