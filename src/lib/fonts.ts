import localFont from "next/font/local";

export const alexer = localFont({
  src: [
    {
      path: "../../public/fonts/alexer/AlexerPro-Light.woff",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-alexer",
});

export const eloquia = localFont({
  src: [
    {
      path: "../../public/fonts/eloquia/EloquiaText-ExtraLight.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-eloquia",
});
