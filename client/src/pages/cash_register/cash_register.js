import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/cash_register.css';
import data from '../../data/mydata.json';

export default function () {

    const [searchInput, setSearchInput] = useState("");
    const [cartItems, setCartItems] = useState([]);

    function searchItem() {
        for (const item of data) {
            if(item.codeBarList instanceof Array) {
                for (const codebar of item.codeBarList) {
                    if(codebar === searchInput) {
                        for (const cartitem of cartItems) {
                            if(cartItems.indexOf(cartitem) >= 0) {
                                return;
                            }
                        }
                        setCartItems(() => [
                            ...cartItems,
                            item
                        ]);
                    }
                }
            }
        }
    }

    useEffect(() => {
        searchItem();
    }, [searchInput]);

    return (
        <div className="cash-register">
            <div className="screen left">
                <Link to="add_items">Add Items</Link>
                <div className="id-scanner">
                    <input 
                        type="text" 
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </div>
                <div className="list-of-products">
                    <table>
                    {cartItems.map((item, itemIndex) => {
                        return (
                            <tbody key={itemIndex}>
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.disegnation}</td>
                                    <td>{item.Nbr}</td>
                                    <td>{item['p.u'] /* + ".00" */}</td>
                                </tr>
                            </tbody>
                        );
                    })}
                    </table> 
                </div>
            </div>
            <div className="screen right">
                <h1>$$$$</h1>
            </div>
        </div>
    );
}
