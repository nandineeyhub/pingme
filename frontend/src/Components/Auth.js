import { useState } from "react"
import Login from "./Login"
import Registration from "./Registration"

const Auth = () => {
  const [account, setAccount] = useState(true)
  return account ? <Login setAccount={setAccount}/> : <Registration setAccount={setAccount}/>
}

export default Auth