import type { PropsWithChildren } from "react";

import styles from "./Main.module.scss";

type MainProps = {
    large?: boolean;
    overflow?: boolean;
    fitContent?: boolean;
};
export function Main({ large, overflow, children, fitContent }: PropsWithChildren<MainProps>) {
    return (
        <main
            className={styles.root}
            data-large={large}
            data-overflow={overflow}
            data-fit-content={fitContent}
        >{children}</main>
    );
}
