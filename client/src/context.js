import React, { useState } from 'react';

const Context = React.createContext();


function ContextProvider(props) {

    const randomFunction = () => console.log('random context function');
    
    const [itemToUpdate, setItemToUpdate] = useState({});
    const updateItem = item => setItemToUpdate(() => item);

    return (
        <Context.Provider value={{
            randomFunction,
            updateItem,
            itemToUpdate,
        }}>
            {props.children}
        </Context.Provider>
    );
}

const ContextConsumer = Context;

export { ContextProvider, ContextConsumer }
