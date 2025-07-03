const { createContext, useState, useContext} = require("react");


const UserContext = createContext(null);

const defaultUser = {
    name : 'Clyde Kira',
    email : 'insertemail@biztechs.com',
    role: 'Admin',
    status: 'Active',
    avatar: null //placeholder for profile pictures
};

//provider component
export const UserProvider = ({children}) => {
    const [user, setUser] = useState(defaultUser);

    return(
        <UserContext.Provider value = {{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

//customer hook to use the user context
export const useUser = () => {
    const context = useContext(UserContext);
    
    if (context === undefined){
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
