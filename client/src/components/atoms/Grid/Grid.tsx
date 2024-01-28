import { CSSProperties, PropsWithChildren, useEffect, useState } from "react";
import Styles from "./Grid.module.scss";

type GridProps = {
    columns?: number;
    autoFit?: number | null;
    gap?: "small" | "medium" | "large" | number;
    className?: string;
    responsive?: ResponsiveGrid[];
    style?: CSSProperties;
};

type ResponsiveGrid = {
    breakpoint: number;
    settings: {
        columns?: number;
        autoFit?: number | null;
        gap?: "small" | "medium" | "large" | number;
    };
};

export const Grid = ({
    columns = 2,
    autoFit = null,
    gap,
    style,
    className = "",
    responsive = [],
    children,
}: PropsWithChildren<GridProps>) => {
    const [props, setProps] = useState<GridProps>({
        columns,
        autoFit,
        gap,
        className,
    });

    const setGap = () => {
        switch (props.gap) {
            case "small":
                return 10;
            case "medium":
                return 15;
            case "large":
                return 20;
            default:
                return props.gap;
        }
    };

    useEffect(() => {
        if (!responsive?.length) return;

        const handleResize = () => {
            const newBreakpoint = window.innerWidth;

            const checkBreakpoint = responsive
                .sort((a, b) => a.breakpoint - b.breakpoint)
                .find((resp) => newBreakpoint <= resp.breakpoint);

            setProps((prev) => {
                if (checkBreakpoint) {
                    return {
                        ...prev,
                        columns: checkBreakpoint.settings.columns
                            ? checkBreakpoint.settings.columns
                            : 2,
                        autoFit: checkBreakpoint.settings.autoFit
                            ? checkBreakpoint.settings.autoFit
                            : null,
                        gap: checkBreakpoint.settings.gap
                            ? checkBreakpoint.settings.gap
                            : gap,
                    };
                } else {
                    return { ...prev, columns, autoFit, gap };
                }
            });
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [autoFit, columns, gap, responsive]);

    return (
        <div
            className={`${Styles.Grid} ${className}`}
            style={{
                gridTemplateColumns: props.autoFit
                    ? `repeat(auto-fit, minmax(min(100%, ${props.autoFit}px), 1fr))`
                    : `repeat(${props.columns}, 1fr)`,
                gap: setGap(),
                ...style,
            }}
        >
            {children}
        </div>
    );
};
