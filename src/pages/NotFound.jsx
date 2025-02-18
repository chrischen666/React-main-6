import { Link } from "react-router";
export default function NotFound() {
  return (
    <>
      <h1>找不到頁面</h1>
      <Link to="/">回首頁</Link>
    </>
  );
}
