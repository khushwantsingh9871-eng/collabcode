import { useState } from "react";
import  UserContext  from "./userContext";

function UserProvider({ children }) {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') ));


  

//   return savedUser ? JSON.parse(savedUser) : null;

  return (<>
            
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    </>
  );
}

export default UserProvider;