import { CSSProperties, PropsWithChildren, useEffect, useState } from "react";
import Styles from "./Flex.module.scss";

type FlexProps = {
    vertical?: boolean;
    wrap?: "wrap" | "nowrap";
    justify?:
        | "flex-start"
        | "center"
        | "flex-end"
        | "stretch"
        | "space-between"
        | "space-around"
        | "space-evenly";
    align?: "flex-start" | "center" | "flex-end" | "stretch";
    gap?: "small" | "medium" | "large" | number;
    className?: string;
    responsive?: ResponsiveFlex[];
    style?: CSSProperties;
};

type ResponsiveFlex = {
    breakpoint: number;
    settings: {
        vertical?: boolean;
        wrap?: "wrap" | "nowrap";
        justify?:
            | "flex-start"
            | "center"
            | "flex-end"
            | "stretch"
            | "space-between"
            | "space-around"
            | "space-evenly";
        align?: "flex-start" | "center" | "flex-end" | "stretch";
        gap?: "small" | "medium" | "large" | number;
    };
};

export const Flex = ({
    vertical = false,
    wrap = "nowrap",
    justify = "flex-start",
    align = "flex-start",
    className = "",
    responsive = [],
    gap,
    style,
    children,
}: PropsWithChildren<FlexProps>) => {
    const [props, setProps] = useState<FlexProps>({
        vertical,
        wrap,
        justify,
        align,
        gap,
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
                        vertical: checkBreakpoint?.settings?.vertical
                            ? checkBreakpoint.settings.vertical
                            : false,
                        wrap: checkBreakpoint?.settings?.wrap
                            ? checkBreakpoint.settings.wrap
                            : "nowrap",
                        justify: checkBreakpoint?.settings?.justify
                            ? checkBreakpoint.settings.justify
                            : "flex-start",
                        align: checkBreakpoint?.settings?.align
                            ? checkBreakpoint.settings.align
                            : "flex-start",
                        gap: checkBreakpoint?.settings?.gap
                            ? checkBreakpoint.settings.gap
                            : gap,
                    };
                } else {
                    return { ...prev, vertical, wrap, justify, align, gap };
                }
            });
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [align, gap, justify, responsive, vertical, wrap]);

    return (
        <div
            className={`${Styles.Flex} ${className}`}
            style={{
                flexDirection: props.vertical ? "column" : "row",
                justifyContent: props.justify,
                alignItems: props.align,
                flexWrap: props.wrap,
                gap: setGap(),
                ...style,
            }}
        >
            {children}
        </div>
    );
};
