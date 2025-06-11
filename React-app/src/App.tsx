import { Link, Outlet, useNavigate } from "react-router";
import { clearToken, getToken } from "./models/apiClient";
import { PrimaryButton } from "./components/PrimaryButton";

export function App() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export function Nav() {
  const navigate = useNavigate();
  return(
    <article>
      <nav>
        <menu>
          <PrimaryButton><Link to={"/students-posts"}>Students Posts Page</Link></PrimaryButton>
          <PrimaryButton><Link to={"/teachers-posts"}>Teachers Posts Page</Link></PrimaryButton>
        </menu>
      </nav>
      <article>
        <p>Hello {getUserName()}</p>
        <PrimaryButton onClick={() => {
          clearToken();
          navigate("/login");
        }}>Logout</PrimaryButton>
      </article>
    </article>
  );
}

function getUserName() {
  const token = getToken();

  if (!token) {
    return "";
  }

  const [, encodedPayload] = token.split(".");
  const rawPayload = atob(encodedPayload);

  try {
    const payload = JSON.parse(rawPayload);

    return payload.userName;
  } catch {
    return "";
  }
}