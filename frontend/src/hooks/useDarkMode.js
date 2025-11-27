import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    localStorage.setItem("dark", dark);
    document.body.setAttribute("data-bs-theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, () => setDark((d) => !d)];
}
