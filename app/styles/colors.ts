// Color Palette - Contemporary Neutral + Color Touch
// Base palette with Petrol Blue accent and Elegant Coral for actions

export const colors = {
  // Base / Neutrals
  graphite: "#2C2C2C", // Headers, strong text, dark background
  sand: "#EAEAEA", // Light background, neutral areas
  white: "#FFFFFF", // Cards, inputs, main surfaces
  mediumGray: "#AFAFAF", // Borders, placeholders
  darkGray: "#4A4A4A", // Subtitles
  lineBorder: "#DCDCDC", // Light borders
  shadowLight: "#0000001A", // Soft shadows

  // Primary Highlight Color - Petrol Blue (Information/Navigation)
  petrolBlue: "#1D5F6F", // Main accent, secondary buttons, active states
  petrolBlueLight: "#327A8A", // Hover state
  petrolBlueDark: "#14434D", // Pressed state
  petrolBlueMist: "#F0F7F8", // Subtle highlight

  // Primary Action Color - Elegant Coral (Confirm/Save)
  coral: "#FF6F61", // Primary buttons, main actions
  coralLight: "#FF867A", // Hover state
  coralDark: "#E85A4F", // Pressed state
  coralSoft: "#FFC4BF", // Disabled state

  // Feedback Colors
  // Error
  errorPrimary: "#E63946",
  errorDark: "#A8232C",
  errorLight: "#F9D7DA",

  // Deletion
  deletionPrimary: "#D72638",
  deletionHover: "#F83B4A",
  deletionPressed: "#B01E2D",

  // Warning
  warningPrimary: "#FFB400",
  warningHover: "#FFC733",
  warningLight: "#FFF4D4",

  // Success
  successPrimary: "#2BAE66",
  successHover: "#39C77A",
  successLight: "#D6F5E4",

  // Info
  infoPrimary: "#4A90E2",
  infoLight: "#D9E9FA",
} as const;

// Tailwind-compatible color classes generator
export const colorClasses = {
  // Backgrounds
  bgPrimary: "bg-white",
  bgSecondary: "bg-[#EAEAEA]",
  bgDark: "bg-[#2C2C2C]",

  // Text
  textPrimary: "text-[#2C2C2C]",
  textSecondary: "text-[#4A4A4A]",
  textMuted: "text-[#AFAFAF]",
  textLight: "text-white",

  // Buttons
  btnPrimary:
    "bg-[#FF6F61] text-white hover:bg-[#FF867A] active:bg-[#E85A4F] disabled:bg-[#FFC4BF]",
  btnSecondary: "bg-[#1D5F6F] text-white hover:bg-[#327A8A] active:bg-[#14434D]",
  btnTertiary: "bg-transparent text-[#1D5F6F] border border-[#1D5F6F] hover:bg-[#F0F7F8]",
  btnDanger: "bg-[#D72638] text-white hover:bg-[#F83B4A] active:bg-[#B01E2D]",

  // States
  borderColor: "border-[#DCDCDC]",
  focusRing: "focus:ring-[#1D5F6F]",
  focusBorder: "focus:border-[#1D5F6F]",
} as const;
