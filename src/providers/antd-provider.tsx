import { ConfigProvider, theme as antdTheme } from "antd"
import { type ReactNode } from "react"
import { useTheme } from "../hooks"

const AntdProvider = ({ children }: { children: ReactNode }) => {
  const { isDarkMode, primary, primaryForeground, primaryTint } = useTheme()

  return (
    <ConfigProvider
      modal={{ mask: { blur: true } }}
      drawer={{ mask: { blur: true } }}
      theme={{
        algorithm: isDarkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          fontFamily: "Inter, sans-serif",
          colorText: "var(--color-text)",
          colorPrimary: primary,
          colorPrimaryHover: primary,
          colorWhite: primaryForeground,
          colorBgSpotlight: isDarkMode ? "#2e2e2e" : "#171717",
          colorTextLightSolid: "#fafafa",
          colorError: isDarkMode ? "#d9596b" : "#a82134",
          blue5: primary,
          screenLG: 1024,
          screenSM: 640,
          borderRadius: 0,
          colorBgContainer: "var(--color-bg)",
          colorBgElevated: "var(--color-bg)",
        },
        components: {
          Button: {
            boxShadow: "none",
            boxShadowSecondary: "none",
            boxShadowTertiary: "none",
            defaultShadow: "none",
            primaryShadow: "none",
            dangerShadow: "none",
            primaryColor: primaryForeground,
          },
          Table: {
            fontSize: 13,
            headerBorderRadius: 0,
            borderRadius: 0,
            borderRadiusLG: 0,
            borderRadiusSM: 0,
            borderRadiusXS: 0,
            borderRadiusOuter: 0,
            cellFontSize: 14,
            headerColor: "var(--color-fade)",
            headerBg: "var(--color-bg-muted)",
            colorBgContainer: "var(--color-bg)",
            colorText: "var(--color-secondary-alpha)",
            cellPaddingBlock: 10,
            cellPaddingInline: 12,
            selectionColumnWidth: 35,
            rowHoverBg: "var(--color-primary-light)",
            rowSelectedBg: "var(--color-bg)",
            borderColor: "var(--color-border-muted)",
            rowSelectedHoverBg: "var(--color-bg)",
          },
          Input: {
            colorBorder: "var(--color-border)",
            controlHeight: 44,
            controlHeightLG: 44,
            controlHeightSM: 44,
            controlHeightXS: 44,
            borderRadius: 0,
          },
          InputNumber: {
            colorBorder: "var(--color-border)",
            controlHeight: 44,
            controlHeightLG: 44,
            controlHeightSM: 44,
            controlHeightXS: 44,
            borderRadius: 0,
          },
          Select: {
            colorBorder: "var(--color-border)",
            colorTextPlaceholder: "var(--color-fade)",
            controlHeight: 44,
            controlHeightLG: 44,
            controlHeightSM: 44,
            controlHeightXS: 44,
            borderRadius: 0,
          },
          Pagination: {
            itemActiveBg: "var(--color-primary)",
            itemActiveColor: "var(--color-primary-foreground)",
            itemActiveColorHover: "var(--color-primary-foreground)",
          },
          Message: {
            colorError: isDarkMode ? "#d9596b" : "#a82134",
            colorSuccess: primary,
          },
          Modal: {
            borderRadius: 0,
            borderRadiusOuter: 0,
            borderRadiusLG: 0,
            borderRadiusSM: 0,
            borderRadiusXS: 0,
            titleFontSize: 18,
            fontWeightStrong: 700,
            boxShadow: "none",
            boxShadowSecondary: "none",
            boxShadowTertiary: "none",
            contentBg: "var(--color-bg)",
            headerBg: "var(--color-bg)",
          },
          Dropdown: {
            boxShadow: "var(--shadow-hover)",
            boxShadowSecondary: "var(--shadow-hover)",
            boxShadowTertiary: "var(--shadow-hover)",
          },
          Popover: {
            boxShadow: "var(--shadow-hover)",
            boxShadowSecondary: "var(--shadow-hover)",
            boxShadowTertiary: "var(--shadow-hover)",
            borderRadius: 0,
            borderRadiusOuter: 0,
            borderRadiusLG: 0,
            borderRadiusSM: 0,
            borderRadiusXS: 0,
          },
          Menu: {
            itemSelectedBg: primary,
            itemSelectedColor: primaryForeground,
            itemActiveBg: primaryTint,
            itemHoverBg: primaryTint,
            itemColor: "var(--color-fade)",
          },
          DatePicker: {
            colorBorder: "var(--color-border)",
            colorTextPlaceholder: "var(--color-fade)",
            controlHeight: 44,
            borderRadius: 0,
          },
          Skeleton: {
            gradientFromColor: "var(--color-border-muted)",
            gradientToColor: "var(--color-border-active)",
          },
          Tooltip: {
            borderRadius: 0,
            borderRadiusOuter: 0,
            borderRadiusLG: 0,
            borderRadiusSM: 0,
            borderRadiusXS: 0,
          },
          Empty: {
            colorBgContainer: "var(--color-bg)",
            colorText: "var(--color-text)",
            colorBgBase: "var(--color-bg)",
            colorFill: "var(--color-bg)",
          },
          Tag: {
            defaultBg: "var(--color-bg-muted)",
            defaultColor: "var(--color-secondary-alpha)",
          },
          Segmented: {
            trackBg: "var(--color-bg-muted)",
            itemColor: "var(--color-fade)",
            itemHoverColor: "var(--color-text)",
            itemHoverBg: "var(--color-bg)",
            itemActiveBg: "var(--color-bg)",
            itemSelectedBg: "var(--color-bg)",
            itemSelectedColor: "var(--color-text)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntdProvider
