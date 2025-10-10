import Authorization from "@/pages/authorization/Authorization";

import "./App.scss";

function App() {
  return (
    <>
      <p>
        Данные для входа: <br />
        <br />
        Email: admin@mail.ru
        <br />
        Password: admin
      </p>
      <Authorization />
    </>
  );
}

export default App;
