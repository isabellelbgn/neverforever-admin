import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="flex gap-1 items-center justify-center mb-6 mt-2"
    >
      <a href="https://svgshare.com/s/xru">
        <img src="https://svgshare.com/i/xru.svg" title="Logo" alt="Logo" />
      </a>
      <span></span>
    </Link>
  );
}
